export const DB_PORT = 5432;
export const DB_VPC_CIDR = "10.20.0.0/16";
export const DB_AZ_COUNT = 2;

export function dbSubnetCidrs(count: number = DB_AZ_COUNT): string[] {
  return Array.from({ length: count }, (_, i) => `10.20.${i}.0/24`);
}

export function dbIngressRules() {
  return [
    {
      protocol: "tcp",
      fromPort: DB_PORT,
      toPort: DB_PORT,
      cidrBlocks: ["0.0.0.0/0"],
      description:
        "Postgres from anywhere: Lambda egress IPs are not static, TLS and credentials are the control",
    },
  ];
}
