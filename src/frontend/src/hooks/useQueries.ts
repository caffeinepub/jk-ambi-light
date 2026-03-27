import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { AmbiSettings, EffectType } from "../backend.d";
import { useActor } from "./useActor";

export function useSettings() {
  const { actor, isFetching } = useActor();
  return useQuery<AmbiSettings>({
    queryKey: ["settings"],
    queryFn: async () => {
      if (!actor) {
        return defaultSettings();
      }
      return actor.getSettings();
    },
    enabled: !!actor && !isFetching,
    staleTime: 30000,
  });
}

export function useUpdateSettings() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (settings: AmbiSettings) => {
      if (!actor) throw new Error("No actor available");
      return actor.updateSettings(settings);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["settings"] });
    },
  });
}

function defaultSettings(): AmbiSettings {
  return {
    fps: BigInt(60),
    currentPowerState: false,
    autoOnTime: "08:00",
    staticColor: "#4AA3FF",
    ledCount: BigInt(30),
    scheduleDays: [true, true, true, true, true, false, false],
    autoOffTime: "23:00",
    autoPowerEnabled: false,
    selectedEffect: "rainbow" as EffectType,
    screenCaptureActive: false,
  };
}
