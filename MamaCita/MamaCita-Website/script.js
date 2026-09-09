const toggle=document.querySelector('.menu-toggle');const nav=document.querySelector('.nav');toggle.addEventListener('click',()=>nav.classList.toggle('open'));document.querySelectorAll('.nav a').forEach(a=>a.addEventListener('click',()=>nav.classList.remove('open')));const sections=[...document.querySelectorAll('main section[id]')];const links=[...document.querySelectorAll('.nav a')];window.addEventListener('scroll',()=>{let current='home';sections.forEach(s=>{if(scrollY>=s.offsetTop-160)current=s.id});links.forEach(l=>l.classList.toggle('active',l.getAttribute('href')==='#'+current))});
const scheduleData={
 Sunday:[['1:00 PM','Jana','Power Mix & Pilates'],['2:00 PM','Kholoud','Zumba'],['3:00 PM','Jana','Belly Dance & Khaliji'],['4:00 PM','Jana N.','Mix Dance'],['5:00 PM','Kholoud','Full Body'],['6:00 PM','Reem','Zumba & Latin'],['7:00 PM','Jana N.','Belly Dance'],['8:00 PM','Reem','Yoga & Balance'],['9:00 PM','Jana','K-Pop & African']],
 Monday:[['1:00 PM','Jana N.','Yoga & Mobility'],['2:00 PM','Kholoud','Tabata & Core'],['3:00 PM','Jana N.','Belly Dance'],['4:00 PM','Kholoud','Zumba'],['5:00 PM','Jana','Belly Dance'],['6:00 PM','Reem','Abs & Glutes'],['7:00 PM','Reem','Yoga & Stretching'],['8:00 PM','Habiba','Belly Dance'],['9:00 PM','Jana','Latin & Hindi']],
 Tuesday:[['1:00 PM','Kholoud','HIIT & Cardio'],['2:00 PM','Kholoud','Mobility'],['3:00 PM','Kholoud','Zumba'],['4:00 PM','Jana N.','Belly Dance'],['5:00 PM','Zumba','Remix Dance'],['6:00 PM','Jana','Zumba & Hip Hop'],['7:00 PM','Jana N.','Fitness & Power'],['8:00 PM','Reem','Abs & Glutes'],['9:00 PM','Jana','Belly Dance']],
 Wednesday:[['1:00 PM','Reem','Crazy Mix'],['2:00 PM','Reem','Yoga & Mobility'],['3:00 PM','Jana N.','Belly Dance'],['4:00 PM','Kholoud & Reem','Zumba'],['5:00 PM','Kholoud','Kids'],['6:00 PM','Jana N.','Fitness'],['7:00 PM','Jana N.','Belly Dance & Saidi'],['8:00 PM','Habiba','Belly Dance & Saidi'],['9:00 PM','Jana','Yoga']],
 Thursday:[['1:00 PM','Jana N.','Belly Dance'],['2:00 PM','Jana N.','Zumba'],['3:00 PM','Jana N.','Belly Dance'],['4:00 PM','Jana N.','Zumba'],['5:00 PM','Mix Dance','—'],['6:00 PM','Reem','Yoga'],['7:00 PM','Jana Osama','Belly Dance & Saidi'],['8:00 PM','Reem','Zumba'],['9:00 PM','Jana','Belly Dance']]
};

const classSelect=document.getElementById('bookingClass');
const daySelect=document.getElementById('bookingDay');
const timeSelect=document.getElementById('bookingTime');
const bookingCoach=document.getElementById('bookingCoach');
const bookingStatus=document.getElementById('bookingStatus');
const bookingForm=document.getElementById('bookingForm');

if(classSelect && daySelect && timeSelect && bookingForm){
  // A booking class is considered available when its name appears as a standalone
  // class OR as part of a combined class in the published timetable.
  const classNames=[...new Set(Object.values(scheduleData).flat().map(row=>row[2]).filter(c=>c && c!=='—'))];
  const aliases={
    'Zumba':['Zumba','Zumba & Latin','Zumba & Hip Hop'],
    'Belly Dance':['Belly Dance','Belly Dance & Khaliji','Belly Dance & Saidi'],
    'Yoga':['Yoga','Yoga & Balance','Yoga & Stretching','Yoga & Mobility'],
    'Pilates':['Pilates','Power Mix & Pilates'],
    'Power Mix':['Power Mix','Power Mix & Pilates'],
    'Khaliji':['Khaliji','Belly Dance & Khaliji'],
    'Latin':['Latin','Zumba & Latin','Latin & Hindi'],
    'Hip Hop':['Hip Hop','Zumba & Hip Hop'],
    'K-Pop':['K-Pop','K-Pop & African'],
    'K-Pop & African':['K-Pop & African'],
    'African':['K-Pop & African'],
    'Abs':['Abs','Abs & Glutes'],
    'Glutes':['Glutes','Abs & Glutes'],
    'Yoga & Mobility':['Yoga & Mobility'],
    'Mobility':['Mobility','Yoga & Mobility'],
    'Saidi':['Saidi','Belly Dance & Saidi'],
    'Belly Dance & Saidi':['Belly Dance & Saidi'],
    'HIIT & Cardio':['HIIT & Cardio'],
    'Fitness & Power':['Fitness & Power'],
    'Fitness':['Fitness'],
    'Remix Dance':['Remix Dance'],
    'Kids':['Kids','Kids Classes'],
    'Kids Classes':['Kids','Kids Classes']
  };
  const displayClasses=[...new Set([
    'Zumba','Belly Dance','Yoga','Pilates','Kickboxing','K-Pop','Power Mix','Tabata & Core','Tabata','Full Body',
    'Abs','Glutes','Power & HIIT','Latin','Khaliji','Mix Dance','Mobility','Yoga & Stretching','K-Pop & African',
    'Kids Classes','HIIT & Cardio','Yoga & Mobility','Fitness & Power','Crazy Mix','Fitness','Belly Dance & Saidi',
    'Latin & Hindi','Yoga & Balance','Remix Dance','Saidi','Boxing','Hip Hop','Power Mix & Pilates','Zumba & Latin',
    'Zumba & Hip Hop','Fitness','Belly Dance & Khaliji'
  ])].filter(c=>aliases[c] || classNames.includes(c));

  function rowsForClass(cls){
    const terms=aliases[cls] || [cls];
    return Object.entries(scheduleData).flatMap(([day,rows])=>rows
      .filter(row=>terms.includes(row[2]))
      .map(row=>({day,time:row[0],coach:row[1],className:row[2]})));
  }

  displayClasses.forEach(cls=>{
    const o=document.createElement('option');o.value=cls;o.textContent=cls;classSelect.appendChild(o);
  });

  // Put the exact scheduled day/time under every class card.
  document.querySelectorAll('.class-card[data-class]').forEach(card=>{
    const cls=card.dataset.class;
    const box=card.querySelector('.class-schedule');
    if(!box) return;
    const rows=rowsForClass(cls);
    if(!rows.length){ box.textContent='Schedule coming soon'; return; }
    const unique=rows.filter((r,i,a)=>i===a.findIndex(x=>x.day===r.day&&x.time===r.time));
    box.innerHTML=unique.map(r=>`<span>${r.day.slice(0,3)} · ${r.time}</span>`).join('');
  });

  function resetSelect(select, placeholder){select.innerHTML=`<option value="">${placeholder}</option>`;}
  function refreshDays(){
    const cls=classSelect.value;
    resetSelect(daySelect,'Choose a day');
    resetSelect(timeSelect,'Choose a time');
    if(bookingCoach) bookingCoach.value='';
    if(bookingStatus) bookingStatus.textContent=cls?'Choose a day to see its exact scheduled times.':'';
    const rows=rowsForClass(cls);
    const days=[...new Set(rows.map(r=>r.day))];
    days.forEach(day=>{const o=document.createElement('option');o.value=day;o.textContent=day;daySelect.appendChild(o);});
  }
  function refreshTimes(){
    const cls=classSelect.value, day=daySelect.value;
    resetSelect(timeSelect,'Choose a time');
    if(bookingCoach) bookingCoach.value='';
    rowsForClass(cls).filter(r=>r.day===day).forEach(r=>{
      const o=document.createElement('option');o.value=r.time;o.textContent=`${r.time} — ${r.coach}`;timeSelect.appendChild(o);
    });
    if(bookingStatus) bookingStatus.textContent=timeSelect.options.length>1?'Choose the exact time from the published schedule.':'';
  }
  function refreshCoach(){
    const cls=classSelect.value, day=daySelect.value, time=timeSelect.value;
    const row=rowsForClass(cls).find(r=>r.day===day&&r.time===time);
    if(bookingCoach) bookingCoach.value=row?row.coach:'';
    if(bookingStatus) bookingStatus.textContent=row?`${row.day} · ${row.time} · Coach: ${row.coach}`:'';
  }

  refreshDays();
  classSelect.addEventListener('change',refreshDays);
  daySelect.addEventListener('change',refreshTimes);
  timeSelect.addEventListener('change',refreshCoach);

  document.querySelectorAll('.class-card[data-class]').forEach(card=>{
    const n=card.dataset.class;
    card.querySelector('.book-class')?.addEventListener('click',()=>{
      const exactOption=[...classSelect.options].find(o=>o.value===n);
      classSelect.value=exactOption?n:'';
      refreshDays();
      document.getElementById('contact').scrollIntoView({behavior:'smooth'});
      classSelect.focus();
    });
  });

  bookingForm.addEventListener('submit',e=>{
    e.preventDefault();
    const phone=document.getElementById('bookingPhone').value.trim();
    const cls=classSelect.value, day=daySelect.value, time=timeSelect.value;
    const coach=bookingCoach?.value||'';
    if(!cls||!day||!time||!phone){
      if(bookingStatus) bookingStatus.textContent='Please choose the class, day, time, and enter your phone number.';
      return;
    }
    const cleanPhone=phone.replace(/[\s()-]/g,'');
    if(!/^\+?\d{10,15}$/.test(cleanPhone)){
      if(bookingStatus) bookingStatus.textContent='Please enter a valid phone number.';
      return;
    }
    const message=[
      'مرحباً MamaCita ❤️',
      'عايزة أحجز كلاس:',
      `الكلاس: ${cls}`,
      `اليوم: ${day}`,
      `الساعة: ${time}`,
      `المدربة: ${coach}`,
      `رقم الموبايل: ${phone}`
    ].join('\n');
    window.open(`https://wa.me/201036595205?text=${encodeURIComponent(message)}`,'_blank','noopener,noreferrer');
  });
}
