import MessageType from "./MessageType";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type MessageCallback = (message: any) => void;

/**
 * Singleton class providing the websocket connection during the game.
 */
class ConnectionManager {
  private static instance: ConnectionManager | null;

  private readonly client: WebSocket;
  private readonly gameId: string;
  private readonly messageCallbacks: { [k: string]: MessageCallback[] };

  private constructor(gameId: string) {
    this.client = new WebSocket("ws://localhost:5000/");
    this.gameId = gameId;

    this.messageCallbacks = {};
    Object.keys(MessageType).forEach(
      type => (this.messageCallbacks[type] = [])
    );

    this.client.onopen = this.onClientOpen;
    this.client.onmessage = this.onMessageReceived;
  }

  /**
   * Create a new instance (i.e. a new connection) for a new game.
   * This erases the previous game connection if any.
   * @param gameId - the new game id.
   */
  public static createInstance = (gameId: string): ConnectionManager => {
    if (
      !ConnectionManager.instance ||
      ConnectionManager.instance.gameId !== gameId
    ) {
      ConnectionManager.instance = new ConnectionManager(gameId);
    }

    return ConnectionManager.instance!;
  };

  /**
   * Returns the unique instance of ConnectionManager.
   * Throws an error if no instance has been created before with createInstance.
   */
  public static getInstance = (): ConnectionManager => {
    if (!ConnectionManager.instance) {
      throw new Error("There is currently no connection opened.");
    }

    return ConnectionManager.instance!;
  };

  /**
   * Clear current instance and connection, to be called at the end of a game.
   */
  public static clearConnection = (): void => {
    if (!ConnectionManager.instance) {
      return;
    }

    ConnectionManager.instance.client.close();
    ConnectionManager.instance = null;
  };

  /**
   * Register a callback for a specific message type.
   * @param type - Message type for which to register a callback.
   * @param callback - Function to be called whenever a message of this type is received.
   */
  public registerCallbackForMessage = (
    type: MessageType,
    callback: MessageCallback
  ): void => {
    this.messageCallbacks[type] = [...this.messageCallbacks[type], callback];
  };

  private ping = (): void => {
    console.log("ping");
    this.client.send(
      JSON.stringify({ type: MessageType.PING, gameId: this.gameId })
    );
    setTimeout(() => {
      if (ConnectionManager.instance) {
        this.ping();
      }
      // Stop ping if the instance is cleared (i.e. game ended).
    }, 1000);
  };

  private onClientOpen = (): void => {
    console.log("The websocket connection is opened");
    this.client.send(
      JSON.stringify({ type: MessageType.JOIN_GAME, gameId: this.gameId })
    );
    // launch ping loop
    this.ping();
  };

  private onMessageReceived = (msg: MessageEvent): void => {
    try {
      const data = JSON.parse(msg.data);
      if (!Object.values(MessageType).includes(data.type)) {
        console.error("Received invalid message type from server: ", data.type);
      }

      this.messageCallbacks[data.type].forEach(callback => callback(data));
    } catch (e) {
      console.error("Received invalid message from server: ", msg.data);
    }
  };
}

export default ConnectionManager;