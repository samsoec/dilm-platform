import { databaseMode } from "./database";
import { cvDeadLetterQueueName } from "./queue";
import {
  WEBHOOK_FAILURE_METRIC,
  WEBHOOK_METRIC_NAMESPACE,
} from "@dilm/shared-types";

export const LOG_RETENTION = "1 month" as const;
export const LOG_RETENTION_DAYS = 30;
export const MAX_ALARMS = 10;
export const AURORA_MAX_CAPACITY_ACU = 1;
export const SES_BOUNCE_RATE_THRESHOLD = 0.05;
export const SES_COMPLAINT_RATE_THRESHOLD = 0.001;

export type AlarmSpec = {
  key: string;
  name: string;
  description: string;
  namespace: string;
  metricName: string;
  dimensions?: Record<string, string>;
  statistic: "Sum" | "Maximum" | "Average";
  periodSeconds: number;
  evaluationPeriods: number;
  datapointsToAlarm: number;
  threshold: number;
  comparisonOperator: "GreaterThanOrEqualToThreshold";
  treatMissingData: "notBreaching";
};

export type AlarmTargets = {
  stage: string;
  payloadFunctionName: string;
  cvConsumerFunctionName: string;
  auroraClusterIdentifier?: string;
};

export function alarmTopicName(stage: string): string {
  return `dilm-${stage}-alarms`;
}

function alarm(
  stage: string,
  key: string,
  suffix: string,
  description: string,
  metric: Pick<
    AlarmSpec,
    "namespace" | "metricName" | "dimensions" | "statistic"
  >,
  window: {
    periodSeconds: number;
    evaluationPeriods?: number;
    datapointsToAlarm?: number;
  },
  threshold: number,
): AlarmSpec {
  const evaluationPeriods = window.evaluationPeriods ?? 1;
  return {
    key,
    name: `dilm-${stage}-${suffix}`,
    description,
    ...metric,
    periodSeconds: window.periodSeconds,
    evaluationPeriods,
    datapointsToAlarm: window.datapointsToAlarm ?? evaluationPeriods,
    threshold,
    comparisonOperator: "GreaterThanOrEqualToThreshold",
    treatMissingData: "notBreaching",
  };
}

export function alarmSpecs(targets: AlarmTargets): AlarmSpec[] {
  const { stage } = targets;
  const lambda = (
    functionName: string,
    metricName: "Errors" | "Throttles",
  ) => ({
    namespace: "AWS/Lambda",
    metricName,
    dimensions: { FunctionName: functionName },
    statistic: "Sum" as const,
  });
  const specs: AlarmSpec[] = [
    alarm(
      stage,
      "CvDlqDepth",
      "cv-dlq-depth",
      "A CV intake message landed in the dead-letter queue.",
      {
        namespace: "AWS/SQS",
        metricName: "ApproximateNumberOfMessagesVisible",
        dimensions: { QueueName: cvDeadLetterQueueName(stage) },
        statistic: "Maximum",
      },
      { periodSeconds: 60 },
      1,
    ),
    alarm(
      stage,
      "PayloadErrors",
      "payload-errors",
      "The Payload Lambda returned errors.",
      lambda(targets.payloadFunctionName, "Errors"),
      { periodSeconds: 300 },
      1,
    ),
    alarm(
      stage,
      "PayloadThrottles",
      "payload-throttles",
      "The Payload Lambda was throttled.",
      lambda(targets.payloadFunctionName, "Throttles"),
      { periodSeconds: 300 },
      1,
    ),
    alarm(
      stage,
      "CvConsumerErrors",
      "cv-consumer-errors",
      "The CV consumer Lambda returned errors.",
      lambda(targets.cvConsumerFunctionName, "Errors"),
      { periodSeconds: 300 },
      1,
    ),
    alarm(
      stage,
      "SesBounceRate",
      "ses-bounce-rate",
      "Account SES bounce rate reached 5 percent.",
      {
        namespace: "AWS/SES",
        metricName: "Reputation.BounceRate",
        statistic: "Maximum",
      },
      { periodSeconds: 3600 },
      SES_BOUNCE_RATE_THRESHOLD,
    ),
    alarm(
      stage,
      "SesComplaintRate",
      "ses-complaint-rate",
      "Account SES complaint rate reached 0.1 percent.",
      {
        namespace: "AWS/SES",
        metricName: "Reputation.ComplaintRate",
        statistic: "Maximum",
      },
      { periodSeconds: 3600 },
      SES_COMPLAINT_RATE_THRESHOLD,
    ),
    alarm(
      stage,
      "WebhookFailure",
      "webhook-failure",
      "A job-platform webhook call failed.",
      {
        namespace: WEBHOOK_METRIC_NAMESPACE,
        metricName: WEBHOOK_FAILURE_METRIC,
        dimensions: { Stage: stage },
        statistic: "Sum",
      },
      { periodSeconds: 300 },
      1,
    ),
  ];
  if (databaseMode(stage) === "aurora" && targets.auroraClusterIdentifier) {
    specs.push(
      alarm(
        stage,
        "AuroraCapacityAtMax",
        "aurora-capacity-at-max",
        "Aurora sat at its maximum capacity for 30 minutes.",
        {
          namespace: "AWS/RDS",
          metricName: "ServerlessDatabaseCapacity",
          dimensions: { DBClusterIdentifier: targets.auroraClusterIdentifier },
          statistic: "Average",
        },
        { periodSeconds: 300, evaluationPeriods: 6 },
        AURORA_MAX_CAPACITY_ACU,
      ),
    );
  }
  if (specs.length > MAX_ALARMS) {
    throw new Error(`At most ${MAX_ALARMS} alarms are allowed.`);
  }
  return specs;
}

export function alarmEmailPlan(
  stage: string,
  email: string | undefined,
): { email?: string; log?: string } {
  const trimmed = email?.trim();
  if (trimmed) {
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed)) {
      throw new Error("ALARM_EMAIL is not an email address.");
    }
    return { email: trimmed };
  }
  if (stage === "production") {
    throw new Error("ALARM_EMAIL is required on production.");
  }
  return {
    log: `ALARM_EMAIL is not set: the ${stage} alarm topic is created without a subscriber.`,
  };
}
