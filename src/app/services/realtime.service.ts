// realtimeService.ts
import { ref, set, get, onValue, remove } from "firebase/database";
import { database } from "../firebaseConfig";

class RealtimeService {
  private db = database;

  async setRelayState(relayId: string, state: boolean) {
    try {
      await set(ref(this.db, `relays/${relayId}`), state);
    } catch (error) {
      console.error("Error setting relay state:", error);
    }
  }

  async getRelayState(relayId: string) {
    try {
      const snapshot = await get(ref(this.db, `relays/${relayId}`));
      return snapshot.exists() ? snapshot.val() : null;
    } catch (error) {
      console.error("Error getting relay state:", error);
      return null;
    }
  }

  listenToRelayState(relayId: string, callback: (state: boolean) => void) {
    const relayRef = ref(this.db, `relays/${relayId}`);
    onValue(relayRef, (snapshot) => {
      callback(snapshot.val());
    });
  }

  async removeRelay(relayId: string) {
    try {
      await remove(ref(this.db, `relays/${relayId}`));
    } catch (error) {
      console.error("Error removing relay:", error);
    }
  }
}

export const realtimeService = new RealtimeService();
