/**
 * Track object, which is not an entity because not saved in the database.
 */
export class Track {
  public id: string;
  public name: string;
  public previewUrl: string;
  public trackNumber: number;
  public artist: string;
}
