/* Browser-native speech control for the leadership presentation. */
window.CortexWalkthrough = function (app) {
  const root = document.querySelector('.content');
  if (!root) return;
  const steps = [
    {title:'More orders. Same small team.', copy:'Meet Cortex: a calmer operations desk for a growing consumer brand. This walkthrough turns three everyday requests into a clear category, a suggested next action, and a timestamped record.', proof:'The leadership question: can the team handle more operational work while keeping people in control?', target:'.stats'},
    {title:'Move an order toward fulfillment.', copy:'A new order comes in. Cortex identifies the workflow, masks the shipping address, and suggests the next fulfillment step. The original operational context stays visible in the activity log.', proof:'What to notice below: order classification, masked customer details, and a concrete next action.', sample:'order', target:'#intake'},
    {title:'Keep judgment with your people.', copy:'A customer wants to cancel a subscription. Cortex routes the ticket for a policy check and flags human review, giving the team a clear next step before anyone responds.', proof:'What to notice below: the cancellation is flagged for a teammate. No reply is sent and no shipment is changed.', sample:'support', target:'#intake'},
    {title:'Give finance a clear approval path.', copy:'An invoice arrives for $2,450. Cortex suggests matching the purchase order and getting approval before the due date. Finance gets the context it needs to act.', proof:'What to notice below: invoice classification, approval guidance, and the timestamped entry.', sample:'invoice', target:'#intake'},
    {title:'Every processed item has a trail.', copy:'All three examples are recorded here with their submitted details, category, suggested next action, and time. The team can see what happened without piecing together an inbox.', proof:'These walkthrough entries are temporary. Leaving the demo restores the activity you had before it.', target:'#activity', runAll:true},
    {title:'Start with one workflow. Prove the value.', copy:'Choose a recurring task with its owner, try representative examples, and agree on what a useful pilot should demonstrate. Cortex Starter is $99 per month for up to 10 teammates and 2,000 operations.', proof:'Next step: share this walkthrough with the person who owns your most repetitive operational task.', target:'.demo-recap', recap:true}
  ];
  const launch = document.createElement('section');
  launch.className = 'leadership-launch';
  launch.innerHTML = '<div><h2>Your leadership walkthrough, hands-free.</h2><p>Six short steps. Three live examples. Say “next” to keep the story moving.</p></div><button type="button" id="launchLeadership">Start leadership demo →</button>';
  const panel = document.createElement('section');
  panel.className = 'demo-panel'; panel.hidden = true; panel.id = 'leadershipDemo';
  panel.setAttribute('aria-label','Leadership walkthrough');
  panel.innerHTML = `<div class="demo-panel-top"><div class="demo-kicker">Cortex / Leadership demo</div><div class="demo-panel-actions"><button type="button" class="demo-plain" id="demoFullscreen">Full screen</button><button type="button" class="demo-plain" id="demoExit">Exit demo</button></div></div>
    <div class="demo-body"><div class="demo-step-number" id="demoStepNumber"></div><div class="demo-heading"><h2 id="demoTitle" tabindex="-1"></h2></div><p class="demo-copy" id="demoCopy"></p><div class="demo-proof" id="demoProof"></div><div class="demo-recap" hidden><div class="demo-recap-item"><strong>$99 / month</strong><span>Starter · 2,000 operations · up to 10 teammates</span><a href="/plans">Explore the plan →</a></div><div class="demo-recap-item"><strong>One useful pilot</strong><span>One workflow owner. Representative tasks. Clear success criteria.</span><a href="/share">Share Cortex with your team →</a></div></div><div class="demo-steps" aria-label="Walkthrough steps"></div></div>
    <div class="demo-controls"><div class="demo-mic-group"><button type="button" id="demoMic" class="demo-mic" aria-pressed="false"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true"><rect x="9" y="2" width="6" height="12" rx="3"/><path d="M5 10v2a7 7 0 0 0 14 0v-2M12 19v3m-4 0h8"/></svg><span id="demoMicLabel">Enable voice</span><span class="mic-dot"></span></button><span id="demoVoiceStatus" class="demo-voice-status" role="status" aria-live="polite"></span></div><div class="demo-navigation"><button type="button" id="demoBack" class="demo-plain">← Back</button><button type="button" id="demoRestart" class="demo-plain">Restart</button><button type="button" id="demoNext" class="demo-next">Next →</button></div></div>
    <div class="demo-command-area"><p class="demo-command-label">SAY A COMMAND, OR CLICK IT</p><div class="demo-commands"></div><p class="demo-heard" id="demoHeard" role="status" aria-live="polite">Microphone is off. Enable voice when you are ready.</p><p class="demo-disclosure">Use Chrome or Edge for voice control. Your browser may use its speech service to recognize audio. Cortex does not save audio or transcripts. Workflow examples use rules; dashboard metrics are illustrative.</p></div>`;
  root.querySelector('.welcome').after(launch, panel);
  const el = id => panel.querySelector('#'+id);
  let active = false, index = 0, visited = new Set(), processed = new Set();
  let recognition = null, wantVoice = false, voiceRunning = false, restartTimer = null;
  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  const motion = window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth';
  let highlighted = null;
  function voiceStatus(text) { el('demoVoiceStatus').textContent = text; }
  function showStep(next, moveFocus = false) {
    index = Math.max(0, Math.min(steps.length-1, next));
    const step = steps[index]; visited.add(index);
    el('demoStepNumber').textContent = 'STEP '+(index+1)+' OF '+steps.length;
    el('demoTitle').textContent = step.title; el('demoCopy').textContent = step.copy; el('demoProof').textContent = step.proof;
    el('demoBack').disabled = index === 0; el('demoNext').textContent = index === steps.length-1 ? 'Finish demo ✓' : 'Next →';
    panel.querySelector('.demo-recap').hidden = !step.recap;
    panel.querySelectorAll('.demo-step').forEach((b,i) => { b.classList.toggle('current',i===index); b.classList.toggle('visited',visited.has(i)&&i!==index); if(i===index)b.setAttribute('aria-current','step');else b.removeAttribute('aria-current'); });
    if (step.runAll) ['order','support','invoice'].forEach(key => { if (!processed.has(key)) { app.runSample(key, true); processed.add(key); } });
    if (step.sample) { app.runSample(step.sample, !processed.has(step.sample)); processed.add(step.sample); }
    if (highlighted) highlighted.classList.remove('demo-focus');
    highlighted = document.querySelector(step.target); if(highlighted) highlighted.classList.add('demo-focus');
    panel.scrollIntoView({behavior:motion,block:'start'});
    if(moveFocus) el('demoTitle').focus({preventScroll:true});
  }
  function open() {
    if(active) { panel.scrollIntoView({behavior:motion,block:'start'}); return; }
    active=true; app.onStart(); visited.clear(); processed.clear(); panel.hidden=false; document.body.classList.add('demo-mode');
    const url = new URL(location.href); url.searchParams.set('walkthrough','1'); url.searchParams.delete('demo'); history.replaceState(null,'',url);
    showStep(0,true);
  }
  function stopVoice(message='Microphone is off. You can still use the buttons.') {
    wantVoice=false; clearTimeout(restartTimer);
    if(recognition) { try { recognition.abort(); } catch {} }
    voiceRunning=false; el('demoMic').setAttribute('aria-pressed','false'); el('demoMicLabel').textContent='Enable voice'; voiceStatus(message);
  }
  function close() {
    if(!active)return;
    stopVoice(); active=false; panel.hidden=true; document.body.classList.remove('demo-mode');
    if(highlighted)highlighted.classList.remove('demo-focus'); app.onExit();
    const url=new URL(location.href); url.searchParams.delete('walkthrough'); history.replaceState(null,'',url);
    document.getElementById('launchLeadership').focus({preventScroll:true}); launch.scrollIntoView({behavior:motion,block:'center'});
  }
  function restart() { app.onRestart(); processed.clear(); visited.clear(); showStep(0); }
  function next() { if(index===steps.length-1)close();else showStep(index+1); }
  function command(raw) {
    const text = raw.toLowerCase().replace(/[^a-z0-9\s]/g,' ').replace(/\s+/g,' ').trim().replace(/^(?:hey\s+)?cortex\s+/,'').replace(/^please\s+/,'').replace(/\s+please$/,'');
    el('demoHeard').textContent = 'Heard: “'+raw+'”';
    if(/^(next|next step|next slide|go next|go forward|continue)$/.test(text))next();
    else if(/^(back|go back|previous|previous step|previous slide)$/.test(text))showStep(index-1);
    else if(/^(restart|restart demo|start over|reset demo)$/.test(text))restart();
    else if(/^(overview|show overview|dashboard|show dashboard)$/.test(text))showStep(0);
    else if(/^(order|show order|show orders|order demo|show order demo|try an order)$/.test(text))showStep(1);
    else if(/^(support|show support|support demo|show support demo|show support ticket)$/.test(text))showStep(2);
    else if(/^(invoice|show invoice|show invoices|invoice demo|show invoice demo)$/.test(text))showStep(3);
    else if(/^(activity|show activity|activity log|show activity log)$/.test(text))showStep(4);
    else if(/^(pricing|show pricing|plans|show plans|show plan|pilot|show pilot)$/.test(text))showStep(5);
    else if(/^(stop listening|pause voice|mute|microphone off)$/.test(text))stopVoice('Voice paused. Click Enable voice to resume.');
    else if(/^(exit|exit demo|finish|finish demo|close demo)$/.test(text))close();
    else { el('demoHeard').textContent += ' — Try “next”, “show order”, or a command below.'; return false; }
    return true;
  }
  function beginRecognition() {
    if(!wantVoice||voiceRunning||!active)return;
    voiceRunning=true;
    try { recognition.start(); } catch { voiceRunning=false; stopVoice('Voice could not start. Click Enable voice to try again.'); }
  }
  function enableVoice() {
    if(!SpeechRecognition) return;
    wantVoice=true; voiceStatus('Waiting for microphone permission…');
    el('demoMicLabel').textContent='Starting…'; beginRecognition();
  }
  if(SpeechRecognition) {
    recognition = new SpeechRecognition(); recognition.lang='en-US'; recognition.continuous=true; recognition.interimResults=true;
    recognition.onstart=()=> { if(!wantVoice){recognition.abort();return;} voiceRunning=true; el('demoMic').setAttribute('aria-pressed','true'); el('demoMicLabel').textContent='Stop listening'; voiceStatus('Listening · say “next” or “show order”'); };
    recognition.onresult=event=> { if(!active||!wantVoice)return; for(let i=event.resultIndex;i<event.results.length;i++) { const transcript=event.results[i][0].transcript.trim(); if(event.results[i].isFinal) { command(transcript); if(!active||!wantVoice)break; } else el('demoHeard').textContent='Hearing: “'+transcript+'”'; } };
    recognition.onerror=event=> {
      const fatal = { 'not-allowed':'Microphone permission was denied. Allow it in browser settings, then try again.', 'service-not-allowed':'Speech recognition is blocked by this browser. Try Chrome or Edge, or use the buttons.', 'audio-capture':'No microphone is available. Connect one, then try again.', 'network':'Speech recognition could not connect. Check your connection, then try again.', 'language-not-supported':'English speech recognition is unavailable in this browser. Use the buttons.' };
      if(fatal[event.error])stopVoice(fatal[event.error]);
      else if(event.error==='no-speech')voiceStatus('Still listening. Say a short command when ready.');
    };
    recognition.onend=()=> { voiceRunning=false; if(wantVoice&&active){ voiceStatus('Reconnecting microphone…'); restartTimer=setTimeout(beginRecognition,350); } };
    voiceStatus('Microphone off · click Enable voice to start.');
  } else {
    el('demoMic').disabled=true; el('demoMicLabel').textContent='Voice unavailable'; voiceStatus('This browser does not support voice control. Open in Chrome or Edge, or use the buttons.');
  }
  const labels=['Overview','Order','Support','Invoice','Activity','Pilot'];
  labels.forEach((label,i)=> { const b=document.createElement('button');b.type='button';b.className='demo-step';b.setAttribute('aria-label','Step '+(i+1)+': '+label);b.title=label;b.addEventListener('click',()=>showStep(i));panel.querySelector('.demo-steps').append(b); });
  ['Next','Back','Show order','Show support','Show invoice','Show activity','Show pricing','Restart','Stop listening'].forEach(label=> { const b=document.createElement('button');b.type='button';b.textContent='“'+label.toLowerCase()+'”';b.addEventListener('click',()=>command(label));panel.querySelector('.demo-commands').append(b); });
  document.getElementById('launchLeadership').addEventListener('click',open);
  document.querySelectorAll('[data-leadership]').forEach(b=>b.addEventListener('click',open));
  el('demoExit').addEventListener('click',close); el('demoRestart').addEventListener('click',restart);
  el('demoBack').addEventListener('click',()=>showStep(index-1)); el('demoNext').addEventListener('click',next);
  el('demoMic').addEventListener('click',()=>wantVoice?stopVoice():enableVoice());
  el('demoFullscreen').addEventListener('click',async()=> { try { if(document.fullscreenElement)await document.exitFullscreen();else await document.documentElement.requestFullscreen(); } catch { voiceStatus('Full screen is unavailable. The walkthrough still works in this window.'); } });
  document.addEventListener('fullscreenchange',()=>el('demoFullscreen').textContent=document.fullscreenElement?'Exit full screen':'Full screen');
  if(!document.documentElement.requestFullscreen)el('demoFullscreen').hidden=true;
  document.addEventListener('keydown',event=> { if(!active)return; const editing=/INPUT|TEXTAREA|SELECT/.test(event.target.tagName)||event.target.isContentEditable; if(editing||event.metaKey||event.ctrlKey||event.altKey)return; if(event.key==='ArrowRight'){event.preventDefault();next();}else if(event.key==='ArrowLeft'){event.preventDefault();showStep(index-1);}else if(event.key==='Escape'&&!document.fullscreenElement)close(); });
  document.addEventListener('visibilitychange',()=> { if(document.hidden&&wantVoice)stopVoice('Voice paused while this tab was hidden. Click Enable voice to resume.'); });
  window.addEventListener('pagehide',()=>stopVoice());
  if(new URLSearchParams(location.search).get('walkthrough')==='1')open();
};
