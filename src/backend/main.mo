import Map "mo:core/Map";
import Time "mo:core/Time";
import Array "mo:core/Array";
import Iter "mo:core/Iter";
import Runtime "mo:core/Runtime";
import Nat "mo:core/Nat";

actor {
  type EffectType = {
    #static;
    #rainbow;
    #breathe;
    #fire;
    #music;
  };

  type ScheduledTask = {
    taskId : Nat;
    effect : EffectType;
    startTime : Text;
    endTime : Text;
    daysActive : [Bool]; // Monday - Sunday
  };

  type AmbiSettings = {
    ledCount : Nat;
    fps : Nat;
    autoPowerEnabled : Bool;
    autoOnTime : Text;
    autoOffTime : Text;
    scheduleDays : [Bool];
    currentPowerState : Bool;
    screenCaptureActive : Bool;
    selectedEffect : EffectType;
    staticColor : Text;
  };

  let defaultSettings : AmbiSettings = {
    ledCount = 30;
    fps = 60;
    autoPowerEnabled = false;
    autoOnTime = "08:00";
    autoOffTime = "23:00";
    scheduleDays = Array.repeat(false, 7); // Initialize with 7 false values
    currentPowerState = false;
    screenCaptureActive = false;
    selectedEffect = #static;
    staticColor = "#FFFFFF";
  };

  // Persistent storage
  var nextTaskId = 1;
  let tasks = Map.empty<Nat, ScheduledTask>();

  // In-memory settings with persistent backup
  var currentSettings : AmbiSettings = defaultSettings;

  public shared ({ caller }) func updateSettings(newSettings : AmbiSettings) : async () {
    if (newSettings.fps < 10 or newSettings.fps > 114) {
      Runtime.trap("FPS out of range (10-114)!");
    };
    currentSettings := newSettings;
  };

  public query ({ caller }) func getSettings() : async AmbiSettings {
    currentSettings;
  };

  public shared ({ caller }) func addTask(effect : EffectType, startTime : Text, endTime : Text, daysActive : [Bool]) : async Nat {
    let taskId = nextTaskId;
    let newTask : ScheduledTask = {
      taskId;
      effect;
      startTime;
      endTime;
      daysActive;
    };
    tasks.add(taskId, newTask);
    nextTaskId += 1;
    taskId;
  };

  public shared ({ caller }) func removeTask(taskId : Nat) : async () {
    if (not tasks.containsKey(taskId)) { Runtime.trap("Task not found") };
    tasks.remove(taskId);
  };

  public query ({ caller }) func getAllTasks() : async [ScheduledTask] {
    tasks.values().toArray();
  };

  public query ({ caller }) func getTasksForDay(dayIdx : Nat) : async [ScheduledTask] {
    if (dayIdx >= 7) { Runtime.trap("Day index out of range (0-6).") };

    tasks.values().toArray().filter(
      func(task) {
        if (dayIdx < task.daysActive.size()) {
          task.daysActive[dayIdx];
        } else {
          Runtime.trap("Task daysActive array out of range");
        };
      }
    );
  };

  public shared ({ caller }) func updateTaskPowerState(taskId : Nat, newState : Bool) : async () {
    switch (tasks.get(taskId)) {
      case (null) { Runtime.trap("Task not found") };
      case (?task) {
        let updatedTask = {
          task with
          taskId;
        };
        tasks.add(taskId, updatedTask);
      };
    };
  };
};
