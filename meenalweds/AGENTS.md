<!-- LOVABLE:BEGIN -->
> [!IMPORTANT]
> This project is connected to [Lovable](https://lovable.dev). Avoid rewriting
> published git history — force pushing, or rebasing/amending/squashing commits
> that are already pushed — as it rewrites history on Lovable's side and the
> user will likely lose their project history.
>
> Commits you push to the connected branch sync back to Lovable and show up in
> the editor, so keep the branch in a working state.
<!-- LOVABLE:END -->

## Project rules
- The invitation is a single page at `/` composed from section components in `src/components/wedding/`; keep sections there so the route file stays a thin layout.
- All photos, videos and music are Lovable Assets pointers in `src/assets/wedding/*.asset.json`, referenced through `src/components/wedding/media.ts`; never commit raw media binaries.
- All invitation wording, dates and the countdown target live in `src/content/invitation.ts`; components read from it and hide a section when its data is empty. Countdown maths stays in `src/lib/countdown.ts` with a unit test.
- Guest Q&A uses `src/lib/event-assistant.functions.ts` (AI Gateway SDK, server-side only); the server looks event details up from the invitation file by title, so guests cannot inject fake details.
