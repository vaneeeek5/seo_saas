export interface ISemanticProvider {
  /**
   * Fetches similar LSI keywords and search phrases for a given base keyword.
   * @param baseKeyword Root seed keyword / topic
   * @param projectId Project ID to load dynamic encrypted integration credentials
   */
  getSimilarKeywords(baseKeyword: string, projectId?: string): Promise<string[]>;

  /**
   * Fetches monthly search volumes for a list of keywords.
   * @param keywords Array of keywords to query
   * @param projectId Project ID to load dynamic encrypted integration credentials
   */
  getSearchVolume(keywords: string[], projectId?: string): Promise<Record<string, number>>;
}
