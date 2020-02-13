/**
 * Playlist object, which is not an entity because not saved in the database.
 */
export class Playlist {
  public description: string;
  public id: string;
  public name: string;
  public image: string | null;
}
