# J16 Ambi Light

## Current State
App supports both PC/laptop and TV usage. Guide text, FAQ, tips, connection messages, and setup steps all reference PC, laptop, HDMI, and mixed usage.

## Requested Changes (Diff)

### Add
- Nothing new

### Modify
- GuideTab: Remove all PC/laptop/HDMI references. Rewrite TV_STEPS, TV_TIPS, STEPS, FAQ to be TV-only. Remove HDMI workaround tip.
- GuideTab: Install card description to be TV-focused.
- ConnectionCard: Update helper text to be TV-only (no PC/laptop mention).
- SettingsTab: Update USB section description for TV only.
- App.tsx: Update hero subtitle to TV-focused.
- App.tsx: Update footer to mention TV.

### Remove
- All mentions of PC, laptop, HDMI, "Works on PC and TV" from visible UI text.

## Implementation Plan
1. Rewrite GuideTab TV_STEPS, TV_TIPS, STEPS, FAQ arrays for TV-only
2. Update ConnectionCard helper text
3. Update SettingsTab USB section
4. Update App.tsx hero subtitle and footer
