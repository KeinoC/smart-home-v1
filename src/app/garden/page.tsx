'use client';
import React, { useEffect, useState, useCallback } from 'react';
import { Switch } from '@headlessui/react';
import { realtimeService } from '../services/realtime.service';
import { motion } from 'framer-motion';

interface RelayControlProps {
  relayName: string;
  relayState: boolean;
  onToggle: () => void;
}

const RelayControl: React.FC<RelayControlProps> = React.memo(({ relayName, relayState, onToggle }) => (
  <motion.div
    initial={{ x: -50, opacity: 0 }}
    animate={{ x: 0, opacity: 1 }}
    transition={{ duration: 0.3 }}
    className="flex items-center justify-between bg-gray-100 p-4 rounded-lg shadow-md w-80"
  >
    <h2 className="text-xl font-medium text-slate-700">{relayName}</h2>
    <Switch
      checked={relayState}
      onChange={onToggle}
      className={`${relayState ? 'bg-teal-600' : 'bg-slate-700'} relative inline-flex items-center h-6 rounded-full w-11 transition-colors`}
    >
      <span
        className={`${relayState ? 'translate-x-6' : 'translate-x-1'} inline-block w-4 h-4 transform bg-white rounded-full transition-transform`}
      />
    </Switch>
  </motion.div>
));

RelayControl.displayName = 'RelayControl';

const Home: React.FC = () => {
  const [relay1State, setRelay1State] = useState<boolean>(false);
  const [relay2State, setRelay2State] = useState<boolean>(false);
  const [relay3State, setRelay3State] = useState<boolean>(false);
  const [relay4State, setRelay4State] = useState<boolean>(false);

  useEffect(() => {
    const fetchRelayStates = async () => {
      const [state1, state2, state3, state4] = await Promise.all([
        realtimeService.getRelayState('relay1'),
        realtimeService.getRelayState('relay2'),
        realtimeService.getRelayState('relay3'),
        realtimeService.getRelayState('relay4'),
      ]);

      setRelay1State(state1);
      setRelay2State(state2);
      setRelay3State(state3);
      setRelay4State(state4);
    };

    fetchRelayStates();

    const unsubscribes = [
      realtimeService.listenToRelayState('relay1', setRelay1State),
      realtimeService.listenToRelayState('relay2', setRelay2State),
      realtimeService.listenToRelayState('relay3', setRelay3State),
      realtimeService.listenToRelayState('relay4', setRelay4State),
    ];

    return () => {
      unsubscribes.forEach((unsub: void) => {
        if (typeof unsub === 'function') {
          (unsub as () => void)(); // Unsubscribe from updates
        }
      });
    };
  }, []);

  const toggleRelay = useCallback(async (relay: string, currentState: boolean) => {
    await realtimeService.setRelayState(relay, !currentState);
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="flex flex-col items-center justify-center min-h-screen py-2"
    >
      <h1 className="text-4xl font-bold mb-8 text-">Water Control</h1>
      <div className="grid grid-cols-1 gap-8">
        {[
          { id: 'relay1', state: relay1State },
          { id: 'relay2', state: relay2State },
          { id: 'relay3', state: relay3State },
          { id: 'relay4', state: relay4State },
        ].map((relay, index) => (
          <RelayControl
            key={relay.id}
            relayName={`Water Zone ${index + 1}`}
            relayState={relay.state}
            onToggle={() => toggleRelay(relay.id, relay.state)}
          />
        ))}
      </div>
    </motion.div>
  );
};

export default Home;
