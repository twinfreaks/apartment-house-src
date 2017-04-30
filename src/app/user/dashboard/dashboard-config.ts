export class DashboardConfig {
  userID?: string;
  viewBlogs?: boolean = true;
  blogsCount?: number = 3;
  viewEvents?: boolean = true;
  eventsCount?: number = 3;
  viewCalculations?: boolean = true;
  calculationsCount?: number = 3;
  viewProtocols?: boolean = true;
  protocolsCount?: number = 3;
  viewOrder?: string;
  theme?: string;
}
