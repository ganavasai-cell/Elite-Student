public class TimeMergeAnime15Min {

    static String[] scenes = {
        "Boy is sleeping in a boring classroom...",
        "Teacher is writing on board...",
        "Students are noisy...",
        "Boy sees something on ground...",
        "A mysterious digital watch appears...",
        "Watch starts glowing BLUE light...",
        "Boy picks up the watch...",
        "BZZZT! Time suddenly glitches...",
        "Everything freezes in classroom!",
        "Chalk floats in the air...",
        "Teacher is frozen mid-action...",
        "Boy clicks watch again...",
        "TIME STOP ACTIVATED!",
        "Reality UI appears in front of him...",
        "SYSTEM MESSAGE: TIME MERGE DETECTED",
        "Boy shocked: 'What is this power?'",
        "Teacher throws duster (slow motion)",
        "Boy dodges using time shift!",
        "Students panic but frozen in time...",
        "Watch starts overheating...",
        "Unknown voice appears from watch...",
        "NEW LOCATION UNLOCKED: WARADA AREA",
        "Hallway turns dark and glitchy...",
        "Shadows appear in distance...",
        "Boy walks into unknown area...",
        "Future version of boy appears...",
        "Enemy shadow entity awakens...",
        "Time cracks open like glass...",
        "Boy unlocks SECOND TIME MODE...",
        "FINAL WARNING: TIME COLLAPSE IMMINENT",
        "TO BE CONTINUED..."
    };

    public static void main(String[] args) throws InterruptedException {

        System.out.println("🎬 TIME MERGE - FULL 15 MIN ANIME EPISODE START\n");

        for (int i = 0; i < scenes.length; i++) {

            System.out.println("━━━━━━━━━━━━━━━━━━━━━━");
            System.out.println("Scene " + (i + 1));
            System.out.println(scenes[i]);

            // POWER SYSTEM LOGIC
            if (i < 5) {
                System.out.println("Status: NORMAL SCHOOL LIFE");
            } 
            else if (i < 12) {
                System.out.println("Status: MYSTERY WATCH ACTIVATION ⚡");
            } 
            else if (i < 22) {
                System.out.println("Status: TIME STOP MODE ACTIVE ⏳");
            } 
            else {
                System.out.println("Status: WARADA AREA ARC 🌑");
            }

            // SPECIAL EVENTS
            if (i == 8) {
                System.out.println("💥 TIME FREEZE EVENT STARTED!");
            }
            if (i == 12) {
                System.out.println("⚡ POWER UNLOCK: TIME STOP");
            }
            if (i == 21) {
                System.out.println("🌑 NEW ARC STARTS: WARADA AREA");
            }

            System.out.println("━━━━━━━━━━━━━━━━━━━━━━\n");

            Thread.sleep(25000); // 25 seconds per scene (~15 minutes total)
        }

        System.out.println("🎥 EPISODE END - NEXT EPISODE COMING SOON...");
    }
}