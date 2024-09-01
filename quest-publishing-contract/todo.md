### Todo List
- submit() function should not take participant's actor id as input.✅
- add permission controls into service functions.✅
- add stake to publish functionality.✅
- add automatic token transfer on completion functionality.✅
- reject submission after deadline has passed.✅

### E2E Test
- Anyone can publish info quests.✅
- Anyone but the quest publisher can submit to the info quest.✅
- Only the quest pulisher can decide on submissions.✅
- Any participants can only submit to the same info quest once.✅
- One submission can only get decided once.✅
- Only the quest publisher can close a quest.✅
- Quest cannot get closed after marked as completed.✅
- Info quests with rewards require transfer the same amount of commitment to publish.✅ (Currently it only works when the sent value is 0)
- The reward amount will be automatically transferred to the participant whose submission got approved.✅
- Cannot submit after deadline has passed.✅
- Quest with illegal title cannot get published.✅
- Quest with illegal description cannot get published.✅
- Quest with illegal submission requirements cannot get published.✅
- Can query existing quests individually.✅
- Can query all quests with one go.✅
- Automatically close quests passing deadline and transfer back value to the quest publisher.