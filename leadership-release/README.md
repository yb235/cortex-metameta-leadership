# Cortex leadership demo

Public hackathon preview:
https://blank-trinity-attachment-posts.trycloudflare.com/?walkthrough=1

This temporary link works while the local preview server and Cloudflare tunnel are running and the computer stays awake. It is not a permanent deployment.

## Present

Open the link in Chrome or Edge, click Enable voice, and allow microphone access. Say next, back, show order, show support, show invoice, show activity, show pricing, restart, stop listening, or exit demo. Buttons and arrow keys also navigate.

The six-step walkthrough uses actual browser-side sample processing. Entering it creates a temporary activity log; leaving restores the saved activity and counters. Voice transcripts and audio are not stored by Cortex. The browser may use its speech recognition service. Metrics are illustrative, and suggested actions are not sent to real systems.

## Host permanently

This release is a complete static website with no build step. Upload the folder contents to a static host, preserving assets and route folders. The original public ChatGPT site was not updated by this session.

## Verification

51 programmatic checks passed for final/interim speech events, navigation, microphone permission/network fallbacks, classification, address masking, temporary history, browser storage failures, unsupported browsers, and existing page routes. Desktop and mobile layouts were inspected in a browser. Public HTTPS content matches this release. Live microphone transcription has not been tested with a human speaker.
