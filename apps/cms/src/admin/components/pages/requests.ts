export async function failure(response: Response | undefined): Promise<string> {
  if (!response) return "The CMS can't be reached.";
  try {
    const body = (await response.json()) as {
      errors?: { message?: string }[];
    };
    return body.errors?.[0]?.message || "Try again.";
  } catch {
    return "Try again.";
  }
}
