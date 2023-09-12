export interface IGProfileFetch {
  id: string;
  username: string;
  followers_count: number;
  follows_count: number;
  media_count: number;
  insights: Insights;
  error: Error;
}

interface Insights {
  data: Insight[];
  paging: Paging;
}

interface Insight {
  name: string;
  period: string;
  values: Value[];
  title: string;
  description: string;
  id: string;
}

interface Value {
  value: number;
  end_time: string;
}

interface Paging {
  previous: string;
  next: string;
}

interface Error {
  status: string;
  message: string;
}
