export interface InstagramMediaResponse {
  data: Media;
  paging: Paging;
}

interface Media {
  media_product_type: string;
  timestamp: string;
  insights: Insights;
  caption: string;
  id: string;
}

interface Insights {
  data: Insight;
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
}

interface Paging {
  cursors: Cursors;
}

interface Cursors {
  before: string;
  after: string;
}
