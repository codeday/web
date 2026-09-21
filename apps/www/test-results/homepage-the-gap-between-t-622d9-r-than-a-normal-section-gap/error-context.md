# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: homepage.spec.ts >> the gap between the alumni photos section and the StatTrio section is tighter than a normal section gap
- Location: tests/homepage.spec.ts:150:5

# Error details

```
Error: expect(received).toBeLessThan(expected)

Expected: < 100
Received:   192
```

# Page snapshot

```yaml
- generic [active] [ref=e1]:
  - generic [ref=e3]:
    - generic [ref=e5]:
      - banner [ref=e7]:
        - generic [ref=e8]:
          - link [ref=e10] [cursor=pointer]:
            - /url: /
          - link "Events" [ref=e146] [cursor=pointer]:
            - /url: /events
          - link "Micro-Internship" [ref=e147] [cursor=pointer]:
            - /url: /micro-internship
          - link "Research" [ref=e148] [cursor=pointer]:
            - /url: /research
          - link "Contact" [ref=e149] [cursor=pointer]:
            - /url: /contact
          - link "Volunteer" [ref=e150] [cursor=pointer]:
            - /url: /volunteer
          - link "Press" [ref=e151] [cursor=pointer]:
            - /url: /press
          - generic [ref=e152]:
            - button "Donate"
            - iframe [ref=e154] [cursor=pointer]:
              - button "Donate" [ref=f2e4] [cursor=pointer]
      - generic [ref=e155]: CodeDay
      - main [ref=e156]:
        - generic [ref=e157]:
          - generic [ref=e159]:
            - heading "seventeen years of putting students in front of meaningful work." [level=1] [ref=e160]:
              - generic [ref=e161]: seventeen years
              - text: of putting students in front of meaningful work.
            - generic [ref=e162]: CodeDay has been putting students in front of work people were waiting on since 2009, years before anyone would hire them. The maintainers who merge it are the first to notice.
            - link "See where they started" [ref=e165] [cursor=pointer]:
              - /url: "#then-now"
          - generic [ref=e168]:
            - generic [ref=e169]:
              - generic [ref=e170]: 65,972
              - generic [ref=e171]: CodeDay alums since 2009
              - paragraph [ref=e172]: Online + in-person at 599 events across 88 cities
            - generic [ref=e173]:
              - generic [ref=e175]: 69%
              - generic [ref=e176]: Come from low-income households, where a tech job is life-changing
              - paragraph [ref=e177]: Combinaton of self-reported and school data
            - generic [ref=e178]:
              - generic [ref=e180]: $20.53B
              - generic [ref=e181]: Lifetime earnings gain for students who were otherwise unlikely to get a tech job
              - paragraph [ref=e182]: Or $341B if we counted the full salary of every participant, as most nonprofits do
          - generic [ref=e183]:
            - heading "Our alumni are building the future." [level=2] [ref=e185]
            - generic [ref=e186]:
              - generic [ref=e189]:
                - generic [ref=e190]:
                  - generic [ref=e191]: Pat Pataranutaporn
                  - generic [ref=e192]: "Now: Professor at MIT Media Lab"
                  - generic [ref=e193]: "2014: CodeDay in Corvallis"
                - img "Pat Pataranutaporn today" [ref=e195]
              - generic [ref=e198]:
                - generic [ref=e199]:
                  - generic [ref=e200]: Tejas Manohar
                  - generic [ref=e201]: "Now: Founder, High Touch ($2.75B)"
                  - generic [ref=e202]: "2014: CodeDay in Nashville"
                - img "Tejas Manohar today" [ref=e204]
              - generic [ref=e207]:
                - generic [ref=e208]:
                  - generic [ref=e209]: Nikolas Huebecker
                  - generic [ref=e210]: "Now: Founder at Lapel (Y Combinator P25)"
                  - generic [ref=e211]: "2014: CodeDay in Atlanta"
                - img "Nikolas Huebecker today" [ref=e213]
              - generic [ref=e216]:
                - generic [ref=e217]:
                  - generic [ref=e218]: Siham Argaw
                  - generic [ref=e219]: "Now: SDE at Amazon"
                  - generic [ref=e220]: "2024: CodeDay Labs"
                - img "Siham Argaw today" [ref=e222]
          - generic [ref=e224]:
            - heading "CodeDay alumni work for every leading tech company, including:" [level=3] [ref=e225]
            - generic [ref=e226]:
              - generic [ref=e228]:
                - img "Anthropic" [ref=e230]
                - img "Y Combinator" [ref=e233]
                - img "Netflix" [ref=e236]
                - img "Stripe" [ref=e239]
                - img "Google" [ref=e242]
                - img "Apple" [ref=e245]
                - img "Spotify" [ref=e248]
                - img "GitHub" [ref=e251]
                - img "Nvidia" [ref=e254]
                - img "Cloudflare" [ref=e257]
                - img "Airbnb" [ref=e260]
                - img "Uber" [ref=e263]
              - figure "Chris Dovi, Executive Director · CodeVA Partner" [ref=e266]:
                - blockquote [ref=e267]: What I appreciate most about CodeDay is the empowerment and agency it instills in its participants.
                - generic [ref=e268]:
                  - text: Chris Dovi, Executive Director · CodeVA
                  - generic [ref=e269]: Partner
          - generic [ref=e270]:
            - generic [ref=e272]:
              - heading "The only thing that moves you along is what you finished." [level=2] [ref=e273]
              - generic [ref=e274]: The formats stack. The only thing that moves you along is what you have finished.
            - generic [ref=e276]:
              - generic [ref=e277]:
                - generic [ref=e278]:
                  - generic [ref=e279]: 12-24 hours
                  - generic [ref=e280]: CodeDay Event
                - generic [ref=e281]:
                  - generic [ref=e282]: Pitch the thing you want to make on Saturday morning. Build it with a team. By Saturday night, people who have never met you will see it work.
                  - link "Find a city" [ref=e284] [cursor=pointer]:
                    - /url: /events
              - generic [ref=e288]:
                - generic [ref=e289]:
                  - generic [ref=e290]: 1-2 months
                  - generic [ref=e291]: CodeDay Micro-Internship
                - generic [ref=e292]:
                  - generic [ref=e293]: One real issue in a project people actually use, a mentor who has done this before, and a maintainer who will merge your fix or tell you why not.
                  - generic [ref=e294]:
                    - generic [ref=e295]:
                      - generic [ref=e296]:
                        - generic [ref=e297]: On your own time
                        - generic [ref=e298]: Apply directly. Nothing to enrol in.
                      - link "Apply" [ref=e300] [cursor=pointer]:
                        - /url: /micro-internship/register
                    - generic [ref=e304]:
                      - generic [ref=e305]:
                        - generic [ref=e306]: For credit
                        - generic [ref=e307]: Your college's course, your college's credit.
                      - link "Ask your department" [ref=e309] [cursor=pointer]:
                        - /url: /micro-internship#partner
              - generic [ref=e313]:
                - generic [ref=e314]:
                  - generic [ref=e315]: 3+ months
                  - generic [ref=e316]: CodeDay Residency
                - generic [ref=e317]: You already shipped a fix a maintainer merged. Now find what the project needs next, make the case to the people who run it, and build it. They can say no. You keep going until it is in.
          - generic [ref=e322]:
            - heading "Why this matters more than it did five years ago" [level=2] [ref=e323]
            - generic [ref=e325]:
              - paragraph [ref=e326]: GenAI made the work someone else specified cheap. Models do entry-level work now, or soon will.
              - paragraph [ref=e327]: "What is left is the work nobody specified: finding what is worth building, knowing a field well enough to tell what would help, and finishing it for someone who is waiting on it."
              - paragraph [ref=e328]: School still produces people who wait for the assignment. CodeDay has been producing the other kind since 2009, years before college, and the maintainers who merge their work are the first to notice.
              - paragraph [ref=e329]: If that becomes normal instead of lucky, the ordinary twenty-two-year-old is capable of what only the exceptional one is today.
          - generic [ref=e330]:
            - generic [ref=e332]:
              - heading "Students ship into software other people depend on." [level=2] [ref=e333]
              - generic [ref=e334]: Every project below is used by people who have never heard of CodeDay. Every change below was accepted by the people who maintain it.
            - generic [ref=e336]:
              - generic [ref=e338]:
                - generic [ref=e340]:
                  - link "YaadOS Devaansh Pathak" [ref=e343] [cursor=pointer]:
                    - /url: https://showcase.codeday.org/project/cmrhoxc5l709867j1myqpew5uoz
                    - generic [ref=e345]:
                      - text: YaadOS
                      - generic [ref=e346]: Devaansh Pathak
                  - link "RetroDeck Suyash" [ref=e349] [cursor=pointer]:
                    - /url: https://showcase.codeday.org/project/cmrhq1e4a749068j1myt8u7joub
                    - generic [ref=e351]:
                      - text: RetroDeck
                      - generic [ref=e352]: Suyash
                  - link "Fixed toolbar overflow that caused layout issues Codex Editor Powers block-style rich text editors in publishing platforms and CMSs. Powers block editing for millions of CodeX users." [ref=e355] [cursor=pointer]:
                    - /url: https://github.com/codex-team/editor.js/pull/1737
                    - generic [ref=e356]: Fixed toolbar overflow that caused layout issues
                    - generic [ref=e357]: Codex Editor
                    - generic [ref=e358]: Powers block-style rich text editors in publishing platforms and CMSs. Powers block editing for millions of CodeX users.
                  - link "Set default schema on imported example datasets Superset Used by companies to build business intelligence dashboards. Airbnb, Netflix, and Nasdaq run their dashboards on it." [ref=e361] [cursor=pointer]:
                    - /url: https://github.com/apache/superset/pull/16041
                    - generic [ref=e362]: Set default schema on imported example datasets
                    - generic [ref=e363]: Superset
                    - generic [ref=e364]: Used by companies to build business intelligence dashboards. Airbnb, Netflix, and Nasdaq run their dashboards on it.
                  - link "Enabled account linking for Auth0 and GitHub in development. FreeCodeCamp Classroom Used by teachers to track students' coding curriculum progress. Powers classrooms teaching freeCodeCamp's 10 million learners worldwide." [ref=e367] [cursor=pointer]:
                    - /url: https://github.com/freeCodeCamp/classroom/pull/248
                    - generic [ref=e368]: Enabled account linking for Auth0 and GitHub in development.
                    - generic [ref=e369]: FreeCodeCamp Classroom
                    - generic [ref=e370]: Used by teachers to track students' coding curriculum progress. Powers classrooms teaching freeCodeCamp's 10 million learners worldwide.
                  - link "Fixed code so web links were handled correctly Stitches Used to style React web apps with type-safe CSS. Powers Vercel and Framer, millions of weekly downloads." [ref=e373] [cursor=pointer]:
                    - /url: https://github.com/stitchesjs/stitches/pull/1066
                    - generic [ref=e374]: Fixed code so web links were handled correctly
                    - generic [ref=e375]: Stitches
                    - generic [ref=e376]: Used to style React web apps with type-safe CSS. Powers Vercel and Framer, millions of weekly downloads.
                  - link "Added automated tests and testing framework support FreeCodeCamp Classroom Used by teachers to track students' coding curriculum progress. Powers classrooms teaching freeCodeCamp's 10 million learners worldwide." [ref=e379] [cursor=pointer]:
                    - /url: https://github.com/freeCodeCamp/classroom/pull/366
                    - generic [ref=e380]: Added automated tests and testing framework support
                    - generic [ref=e381]: FreeCodeCamp Classroom
                    - generic [ref=e382]: Used by teachers to track students' coding curriculum progress. Powers classrooms teaching freeCodeCamp's 10 million learners worldwide.
                  - link "CASCADEGUARD AI Bakir Dawood" [ref=e385] [cursor=pointer]:
                    - /url: https://showcase.codeday.org/project/cmpjhn3eq59139j1myjm1doj8y
                    - generic [ref=e387]:
                      - text: CASCADEGUARD AI
                      - generic [ref=e388]: Bakir Dawood
                  - link "Updated example to include CSS and modern Mapbox. VisGL Deck Used to visualize large geospatial datasets on interactive maps. Uber built its entire geospatial visualization stack on it." [ref=e391] [cursor=pointer]:
                    - /url: https://github.com/visgl/deck.gl/pull/8026
                    - generic [ref=e392]: Updated example to include CSS and modern Mapbox.
                    - generic [ref=e393]: VisGL Deck
                    - generic [ref=e394]: Used to visualize large geospatial datasets on interactive maps. Uber built its entire geospatial visualization stack on it.
                  - link "Renamed refresh label to Refresh Daily Readings. OpenEnergyDashboard Used by campuses to visualize building energy meter data. Powers energy dashboards across dozens of university campuses." [ref=e397] [cursor=pointer]:
                    - /url: https://github.com/OpenEnergyDashboard/OED/pull/852
                    - generic [ref=e398]: Renamed refresh label to Refresh Daily Readings.
                    - generic [ref=e399]: OpenEnergyDashboard
                    - generic [ref=e400]: Used by campuses to visualize building energy meter data. Powers energy dashboards across dozens of university campuses.
                  - link "Added UI for reusable path variables. Hoppscotch Used by developers to test and debug web APIs. Sixty-thousand GitHub stars; Postman alternative for millions of developers." [ref=e403] [cursor=pointer]:
                    - /url: https://github.com/hoppscotch/hoppscotch/pull/2575
                    - generic [ref=e404]: Added UI for reusable path variables.
                    - generic [ref=e405]: Hoppscotch
                    - generic [ref=e406]: Used by developers to test and debug web APIs. Sixty-thousand GitHub stars; Postman alternative for millions of developers.
                  - link "Frequency 2004 – A Retro Social Network Reimagined Ansh Mishra" [ref=e409] [cursor=pointer]:
                    - /url: https://showcase.codeday.org/project/cmrhpjyv6734154j1myi70222rz
                    - generic [ref=e411]:
                      - text: Frequency 2004 – A Retro Social Network Reimagined
                      - generic [ref=e412]: Ansh Mishra
                  - link "Prevented serialization of ScriptFunction by raising exception Pytorch Used to train and deploy deep learning models in production. Powers ChatGPT, Tesla Autopilot, and most AI research." [ref=e415] [cursor=pointer]:
                    - /url: https://github.com/pytorch/pytorch/pull/61381
                    - generic [ref=e416]: Prevented serialization of ScriptFunction by raising exception
                    - generic [ref=e417]: Pytorch
                    - generic [ref=e418]: Used to train and deploy deep learning models in production. Powers ChatGPT, Tesla Autopilot, and most AI research.
                  - link "Time Capsule Suryansh Kumar" [ref=e421] [cursor=pointer]:
                    - /url: https://showcase.codeday.org/project/cmrhpin8z733174j1mym1qq2e5d
                    - generic [ref=e423]:
                      - text: Time Capsule
                      - generic [ref=e424]: Suryansh Kumar
                  - link "BadBoy500 Akshat Pande" [ref=e427] [cursor=pointer]:
                    - /url: https://showcase.codeday.org/project/cmrhpm01l735693j1mywdggcr06
                    - generic [ref=e429]:
                      - text: BadBoy500
                      - generic [ref=e430]: Akshat Pande
                  - link "Removed the interactive documentation command from the command-line tool. Fastify Used to build fast Node.js backend APIs and microservices. Powers Microsoft, IBM, and Amazon; 10M+ weekly downloads." [ref=e433] [cursor=pointer]:
                    - /url: https://github.com/fastify/fastify-cli/pull/462
                    - generic [ref=e434]: Removed the interactive documentation command from the command-line tool.
                    - generic [ref=e435]: Fastify
                    - generic [ref=e436]: Used to build fast Node.js backend APIs and microservices. Powers Microsoft, IBM, and Amazon; 10M+ weekly downloads.
                  - link "Added min and max error bars to graphs OpenEnergyDashboard Used by campuses to visualize building energy meter data. Powers energy dashboards across dozens of university campuses." [ref=e439] [cursor=pointer]:
                    - /url: https://github.com/OpenEnergyDashboard/OED/pull/975
                    - generic [ref=e440]: Added min and max error bars to graphs
                    - generic [ref=e441]: OpenEnergyDashboard
                    - generic [ref=e442]: Used by campuses to visualize building energy meter data. Powers energy dashboards across dozens of university campuses.
                  - link "Pokémon TOP DOWN GAME Hazeem" [ref=e445] [cursor=pointer]:
                    - /url: https://showcase.codeday.org/project/cmpjim0i279562j1myp3dzlamg
                    - generic [ref=e447]:
                      - text: Pokémon TOP DOWN GAME
                      - generic [ref=e448]: Hazeem
                  - 'link "Chaos Quiz: The Fragile App Burhan Hamid" [ref=e451] [cursor=pointer]':
                    - /url: https://showcase.codeday.org/project/cmpji3rkt66326j1myipd6ph2f
                    - generic [ref=e453]:
                      - text: "Chaos Quiz: The Fragile App"
                      - generic [ref=e454]: Burhan Hamid
                  - link "YaadOS Devaansh Pathak" [ref=e457] [cursor=pointer]:
                    - /url: https://showcase.codeday.org/project/cmrhoxc5l709867j1myqpew5uoz
                    - generic [ref=e459]:
                      - text: YaadOS
                      - generic [ref=e460]: Devaansh Pathak
                  - link "RetroDeck Suyash" [ref=e463] [cursor=pointer]:
                    - /url: https://showcase.codeday.org/project/cmrhq1e4a749068j1myt8u7joub
                    - generic [ref=e465]:
                      - text: RetroDeck
                      - generic [ref=e466]: Suyash
                  - link "Fixed toolbar overflow that caused layout issues Codex Editor Powers block-style rich text editors in publishing platforms and CMSs. Powers block editing for millions of CodeX users." [ref=e469] [cursor=pointer]:
                    - /url: https://github.com/codex-team/editor.js/pull/1737
                    - generic [ref=e470]: Fixed toolbar overflow that caused layout issues
                    - generic [ref=e471]: Codex Editor
                    - generic [ref=e472]: Powers block-style rich text editors in publishing platforms and CMSs. Powers block editing for millions of CodeX users.
                  - link "Set default schema on imported example datasets Superset Used by companies to build business intelligence dashboards. Airbnb, Netflix, and Nasdaq run their dashboards on it." [ref=e475] [cursor=pointer]:
                    - /url: https://github.com/apache/superset/pull/16041
                    - generic [ref=e476]: Set default schema on imported example datasets
                    - generic [ref=e477]: Superset
                    - generic [ref=e478]: Used by companies to build business intelligence dashboards. Airbnb, Netflix, and Nasdaq run their dashboards on it.
                  - link "Enabled account linking for Auth0 and GitHub in development. FreeCodeCamp Classroom Used by teachers to track students' coding curriculum progress. Powers classrooms teaching freeCodeCamp's 10 million learners worldwide." [ref=e481] [cursor=pointer]:
                    - /url: https://github.com/freeCodeCamp/classroom/pull/248
                    - generic [ref=e482]: Enabled account linking for Auth0 and GitHub in development.
                    - generic [ref=e483]: FreeCodeCamp Classroom
                    - generic [ref=e484]: Used by teachers to track students' coding curriculum progress. Powers classrooms teaching freeCodeCamp's 10 million learners worldwide.
                  - link "Fixed code so web links were handled correctly Stitches Used to style React web apps with type-safe CSS. Powers Vercel and Framer, millions of weekly downloads." [ref=e487] [cursor=pointer]:
                    - /url: https://github.com/stitchesjs/stitches/pull/1066
                    - generic [ref=e488]: Fixed code so web links were handled correctly
                    - generic [ref=e489]: Stitches
                    - generic [ref=e490]: Used to style React web apps with type-safe CSS. Powers Vercel and Framer, millions of weekly downloads.
                  - link "Added automated tests and testing framework support FreeCodeCamp Classroom Used by teachers to track students' coding curriculum progress. Powers classrooms teaching freeCodeCamp's 10 million learners worldwide." [ref=e493] [cursor=pointer]:
                    - /url: https://github.com/freeCodeCamp/classroom/pull/366
                    - generic [ref=e494]: Added automated tests and testing framework support
                    - generic [ref=e495]: FreeCodeCamp Classroom
                    - generic [ref=e496]: Used by teachers to track students' coding curriculum progress. Powers classrooms teaching freeCodeCamp's 10 million learners worldwide.
                  - link "CASCADEGUARD AI Bakir Dawood" [ref=e499] [cursor=pointer]:
                    - /url: https://showcase.codeday.org/project/cmpjhn3eq59139j1myjm1doj8y
                    - generic [ref=e501]:
                      - text: CASCADEGUARD AI
                      - generic [ref=e502]: Bakir Dawood
                  - link "Updated example to include CSS and modern Mapbox. VisGL Deck Used to visualize large geospatial datasets on interactive maps. Uber built its entire geospatial visualization stack on it." [ref=e505] [cursor=pointer]:
                    - /url: https://github.com/visgl/deck.gl/pull/8026
                    - generic [ref=e506]: Updated example to include CSS and modern Mapbox.
                    - generic [ref=e507]: VisGL Deck
                    - generic [ref=e508]: Used to visualize large geospatial datasets on interactive maps. Uber built its entire geospatial visualization stack on it.
                  - link "Renamed refresh label to Refresh Daily Readings. OpenEnergyDashboard Used by campuses to visualize building energy meter data. Powers energy dashboards across dozens of university campuses." [ref=e511] [cursor=pointer]:
                    - /url: https://github.com/OpenEnergyDashboard/OED/pull/852
                    - generic [ref=e512]: Renamed refresh label to Refresh Daily Readings.
                    - generic [ref=e513]: OpenEnergyDashboard
                    - generic [ref=e514]: Used by campuses to visualize building energy meter data. Powers energy dashboards across dozens of university campuses.
                  - link "Added UI for reusable path variables. Hoppscotch Used by developers to test and debug web APIs. Sixty-thousand GitHub stars; Postman alternative for millions of developers." [ref=e517] [cursor=pointer]:
                    - /url: https://github.com/hoppscotch/hoppscotch/pull/2575
                    - generic [ref=e518]: Added UI for reusable path variables.
                    - generic [ref=e519]: Hoppscotch
                    - generic [ref=e520]: Used by developers to test and debug web APIs. Sixty-thousand GitHub stars; Postman alternative for millions of developers.
                  - link "Frequency 2004 – A Retro Social Network Reimagined Ansh Mishra" [ref=e523] [cursor=pointer]:
                    - /url: https://showcase.codeday.org/project/cmrhpjyv6734154j1myi70222rz
                    - generic [ref=e525]:
                      - text: Frequency 2004 – A Retro Social Network Reimagined
                      - generic [ref=e526]: Ansh Mishra
                  - link "Prevented serialization of ScriptFunction by raising exception Pytorch Used to train and deploy deep learning models in production. Powers ChatGPT, Tesla Autopilot, and most AI research." [ref=e529] [cursor=pointer]:
                    - /url: https://github.com/pytorch/pytorch/pull/61381
                    - generic [ref=e530]: Prevented serialization of ScriptFunction by raising exception
                    - generic [ref=e531]: Pytorch
                    - generic [ref=e532]: Used to train and deploy deep learning models in production. Powers ChatGPT, Tesla Autopilot, and most AI research.
                  - link "Time Capsule Suryansh Kumar" [ref=e535] [cursor=pointer]:
                    - /url: https://showcase.codeday.org/project/cmrhpin8z733174j1mym1qq2e5d
                    - generic [ref=e537]:
                      - text: Time Capsule
                      - generic [ref=e538]: Suryansh Kumar
                  - link "BadBoy500 Akshat Pande" [ref=e541] [cursor=pointer]:
                    - /url: https://showcase.codeday.org/project/cmrhpm01l735693j1mywdggcr06
                    - generic [ref=e543]:
                      - text: BadBoy500
                      - generic [ref=e544]: Akshat Pande
                  - link "Removed the interactive documentation command from the command-line tool. Fastify Used to build fast Node.js backend APIs and microservices. Powers Microsoft, IBM, and Amazon; 10M+ weekly downloads." [ref=e547] [cursor=pointer]:
                    - /url: https://github.com/fastify/fastify-cli/pull/462
                    - generic [ref=e548]: Removed the interactive documentation command from the command-line tool.
                    - generic [ref=e549]: Fastify
                    - generic [ref=e550]: Used to build fast Node.js backend APIs and microservices. Powers Microsoft, IBM, and Amazon; 10M+ weekly downloads.
                  - link "Added min and max error bars to graphs OpenEnergyDashboard Used by campuses to visualize building energy meter data. Powers energy dashboards across dozens of university campuses." [ref=e553] [cursor=pointer]:
                    - /url: https://github.com/OpenEnergyDashboard/OED/pull/975
                    - generic [ref=e554]: Added min and max error bars to graphs
                    - generic [ref=e555]: OpenEnergyDashboard
                    - generic [ref=e556]: Used by campuses to visualize building energy meter data. Powers energy dashboards across dozens of university campuses.
                  - link "Pokémon TOP DOWN GAME Hazeem" [ref=e559] [cursor=pointer]:
                    - /url: https://showcase.codeday.org/project/cmpjim0i279562j1myp3dzlamg
                    - generic [ref=e561]:
                      - text: Pokémon TOP DOWN GAME
                      - generic [ref=e562]: Hazeem
                  - 'link "Chaos Quiz: The Fragile App Burhan Hamid" [ref=e565] [cursor=pointer]':
                    - /url: https://showcase.codeday.org/project/cmpji3rkt66326j1myipd6ph2f
                    - generic [ref=e567]:
                      - text: "Chaos Quiz: The Fragile App"
                      - generic [ref=e568]: Burhan Hamid
                - generic [ref=e569]:
                  - link "YaadOS Devaansh Pathak" [ref=e572] [cursor=pointer]:
                    - /url: https://showcase.codeday.org/project/cmrhoxc5l709867j1myqpew5uoz
                    - generic [ref=e574]:
                      - text: YaadOS
                      - generic [ref=e575]: Devaansh Pathak
                  - link "RetroDeck Suyash" [ref=e578] [cursor=pointer]:
                    - /url: https://showcase.codeday.org/project/cmrhq1e4a749068j1myt8u7joub
                    - generic [ref=e580]:
                      - text: RetroDeck
                      - generic [ref=e581]: Suyash
                  - link "Fixed toolbar overflow that caused layout issues Codex Editor Powers block-style rich text editors in publishing platforms and CMSs. Powers block editing for millions of CodeX users." [ref=e584] [cursor=pointer]:
                    - /url: https://github.com/codex-team/editor.js/pull/1737
                    - generic [ref=e585]: Fixed toolbar overflow that caused layout issues
                    - generic [ref=e586]: Codex Editor
                    - generic [ref=e587]: Powers block-style rich text editors in publishing platforms and CMSs. Powers block editing for millions of CodeX users.
                  - link "Set default schema on imported example datasets Superset Used by companies to build business intelligence dashboards. Airbnb, Netflix, and Nasdaq run their dashboards on it." [ref=e590] [cursor=pointer]:
                    - /url: https://github.com/apache/superset/pull/16041
                    - generic [ref=e591]: Set default schema on imported example datasets
                    - generic [ref=e592]: Superset
                    - generic [ref=e593]: Used by companies to build business intelligence dashboards. Airbnb, Netflix, and Nasdaq run their dashboards on it.
                  - link "Enabled account linking for Auth0 and GitHub in development. FreeCodeCamp Classroom Used by teachers to track students' coding curriculum progress. Powers classrooms teaching freeCodeCamp's 10 million learners worldwide." [ref=e596] [cursor=pointer]:
                    - /url: https://github.com/freeCodeCamp/classroom/pull/248
                    - generic [ref=e597]: Enabled account linking for Auth0 and GitHub in development.
                    - generic [ref=e598]: FreeCodeCamp Classroom
                    - generic [ref=e599]: Used by teachers to track students' coding curriculum progress. Powers classrooms teaching freeCodeCamp's 10 million learners worldwide.
                  - link "Fixed code so web links were handled correctly Stitches Used to style React web apps with type-safe CSS. Powers Vercel and Framer, millions of weekly downloads." [ref=e602] [cursor=pointer]:
                    - /url: https://github.com/stitchesjs/stitches/pull/1066
                    - generic [ref=e603]: Fixed code so web links were handled correctly
                    - generic [ref=e604]: Stitches
                    - generic [ref=e605]: Used to style React web apps with type-safe CSS. Powers Vercel and Framer, millions of weekly downloads.
                  - link "Added automated tests and testing framework support FreeCodeCamp Classroom Used by teachers to track students' coding curriculum progress. Powers classrooms teaching freeCodeCamp's 10 million learners worldwide." [ref=e608] [cursor=pointer]:
                    - /url: https://github.com/freeCodeCamp/classroom/pull/366
                    - generic [ref=e609]: Added automated tests and testing framework support
                    - generic [ref=e610]: FreeCodeCamp Classroom
                    - generic [ref=e611]: Used by teachers to track students' coding curriculum progress. Powers classrooms teaching freeCodeCamp's 10 million learners worldwide.
                  - link "CASCADEGUARD AI Bakir Dawood" [ref=e614] [cursor=pointer]:
                    - /url: https://showcase.codeday.org/project/cmpjhn3eq59139j1myjm1doj8y
                    - generic [ref=e616]:
                      - text: CASCADEGUARD AI
                      - generic [ref=e617]: Bakir Dawood
                  - link "Updated example to include CSS and modern Mapbox. VisGL Deck Used to visualize large geospatial datasets on interactive maps. Uber built its entire geospatial visualization stack on it." [ref=e620] [cursor=pointer]:
                    - /url: https://github.com/visgl/deck.gl/pull/8026
                    - generic [ref=e621]: Updated example to include CSS and modern Mapbox.
                    - generic [ref=e622]: VisGL Deck
                    - generic [ref=e623]: Used to visualize large geospatial datasets on interactive maps. Uber built its entire geospatial visualization stack on it.
                  - link "Renamed refresh label to Refresh Daily Readings. OpenEnergyDashboard Used by campuses to visualize building energy meter data. Powers energy dashboards across dozens of university campuses." [ref=e626] [cursor=pointer]:
                    - /url: https://github.com/OpenEnergyDashboard/OED/pull/852
                    - generic [ref=e627]: Renamed refresh label to Refresh Daily Readings.
                    - generic [ref=e628]: OpenEnergyDashboard
                    - generic [ref=e629]: Used by campuses to visualize building energy meter data. Powers energy dashboards across dozens of university campuses.
                  - link "Added UI for reusable path variables. Hoppscotch Used by developers to test and debug web APIs. Sixty-thousand GitHub stars; Postman alternative for millions of developers." [ref=e632] [cursor=pointer]:
                    - /url: https://github.com/hoppscotch/hoppscotch/pull/2575
                    - generic [ref=e633]: Added UI for reusable path variables.
                    - generic [ref=e634]: Hoppscotch
                    - generic [ref=e635]: Used by developers to test and debug web APIs. Sixty-thousand GitHub stars; Postman alternative for millions of developers.
                  - link "Frequency 2004 – A Retro Social Network Reimagined Ansh Mishra" [ref=e638] [cursor=pointer]:
                    - /url: https://showcase.codeday.org/project/cmrhpjyv6734154j1myi70222rz
                    - generic [ref=e640]:
                      - text: Frequency 2004 – A Retro Social Network Reimagined
                      - generic [ref=e641]: Ansh Mishra
                  - link "Prevented serialization of ScriptFunction by raising exception Pytorch Used to train and deploy deep learning models in production. Powers ChatGPT, Tesla Autopilot, and most AI research." [ref=e644] [cursor=pointer]:
                    - /url: https://github.com/pytorch/pytorch/pull/61381
                    - generic [ref=e645]: Prevented serialization of ScriptFunction by raising exception
                    - generic [ref=e646]: Pytorch
                    - generic [ref=e647]: Used to train and deploy deep learning models in production. Powers ChatGPT, Tesla Autopilot, and most AI research.
                  - link "Time Capsule Suryansh Kumar" [ref=e650] [cursor=pointer]:
                    - /url: https://showcase.codeday.org/project/cmrhpin8z733174j1mym1qq2e5d
                    - generic [ref=e652]:
                      - text: Time Capsule
                      - generic [ref=e653]: Suryansh Kumar
                  - link "BadBoy500 Akshat Pande" [ref=e656] [cursor=pointer]:
                    - /url: https://showcase.codeday.org/project/cmrhpm01l735693j1mywdggcr06
                    - generic [ref=e658]:
                      - text: BadBoy500
                      - generic [ref=e659]: Akshat Pande
                  - link "Removed the interactive documentation command from the command-line tool. Fastify Used to build fast Node.js backend APIs and microservices. Powers Microsoft, IBM, and Amazon; 10M+ weekly downloads." [ref=e662] [cursor=pointer]:
                    - /url: https://github.com/fastify/fastify-cli/pull/462
                    - generic [ref=e663]: Removed the interactive documentation command from the command-line tool.
                    - generic [ref=e664]: Fastify
                    - generic [ref=e665]: Used to build fast Node.js backend APIs and microservices. Powers Microsoft, IBM, and Amazon; 10M+ weekly downloads.
                  - link "Added min and max error bars to graphs OpenEnergyDashboard Used by campuses to visualize building energy meter data. Powers energy dashboards across dozens of university campuses." [ref=e668] [cursor=pointer]:
                    - /url: https://github.com/OpenEnergyDashboard/OED/pull/975
                    - generic [ref=e669]: Added min and max error bars to graphs
                    - generic [ref=e670]: OpenEnergyDashboard
                    - generic [ref=e671]: Used by campuses to visualize building energy meter data. Powers energy dashboards across dozens of university campuses.
                  - link "Pokémon TOP DOWN GAME Hazeem" [ref=e674] [cursor=pointer]:
                    - /url: https://showcase.codeday.org/project/cmpjim0i279562j1myp3dzlamg
                    - generic [ref=e676]:
                      - text: Pokémon TOP DOWN GAME
                      - generic [ref=e677]: Hazeem
                  - 'link "Chaos Quiz: The Fragile App Burhan Hamid" [ref=e680] [cursor=pointer]':
                    - /url: https://showcase.codeday.org/project/cmpji3rkt66326j1myipd6ph2f
                    - generic [ref=e682]:
                      - text: "Chaos Quiz: The Fragile App"
                      - generic [ref=e683]: Burhan Hamid
                  - link "YaadOS Devaansh Pathak" [ref=e686] [cursor=pointer]:
                    - /url: https://showcase.codeday.org/project/cmrhoxc5l709867j1myqpew5uoz
                    - generic [ref=e688]:
                      - text: YaadOS
                      - generic [ref=e689]: Devaansh Pathak
                  - link "RetroDeck Suyash" [ref=e692] [cursor=pointer]:
                    - /url: https://showcase.codeday.org/project/cmrhq1e4a749068j1myt8u7joub
                    - generic [ref=e694]:
                      - text: RetroDeck
                      - generic [ref=e695]: Suyash
                  - link "Fixed toolbar overflow that caused layout issues Codex Editor Powers block-style rich text editors in publishing platforms and CMSs. Powers block editing for millions of CodeX users." [ref=e698] [cursor=pointer]:
                    - /url: https://github.com/codex-team/editor.js/pull/1737
                    - generic [ref=e699]: Fixed toolbar overflow that caused layout issues
                    - generic [ref=e700]: Codex Editor
                    - generic [ref=e701]: Powers block-style rich text editors in publishing platforms and CMSs. Powers block editing for millions of CodeX users.
                  - link "Set default schema on imported example datasets Superset Used by companies to build business intelligence dashboards. Airbnb, Netflix, and Nasdaq run their dashboards on it." [ref=e704] [cursor=pointer]:
                    - /url: https://github.com/apache/superset/pull/16041
                    - generic [ref=e705]: Set default schema on imported example datasets
                    - generic [ref=e706]: Superset
                    - generic [ref=e707]: Used by companies to build business intelligence dashboards. Airbnb, Netflix, and Nasdaq run their dashboards on it.
                  - link "Enabled account linking for Auth0 and GitHub in development. FreeCodeCamp Classroom Used by teachers to track students' coding curriculum progress. Powers classrooms teaching freeCodeCamp's 10 million learners worldwide." [ref=e710] [cursor=pointer]:
                    - /url: https://github.com/freeCodeCamp/classroom/pull/248
                    - generic [ref=e711]: Enabled account linking for Auth0 and GitHub in development.
                    - generic [ref=e712]: FreeCodeCamp Classroom
                    - generic [ref=e713]: Used by teachers to track students' coding curriculum progress. Powers classrooms teaching freeCodeCamp's 10 million learners worldwide.
                  - link "Fixed code so web links were handled correctly Stitches Used to style React web apps with type-safe CSS. Powers Vercel and Framer, millions of weekly downloads." [ref=e716] [cursor=pointer]:
                    - /url: https://github.com/stitchesjs/stitches/pull/1066
                    - generic [ref=e717]: Fixed code so web links were handled correctly
                    - generic [ref=e718]: Stitches
                    - generic [ref=e719]: Used to style React web apps with type-safe CSS. Powers Vercel and Framer, millions of weekly downloads.
                  - link "Added automated tests and testing framework support FreeCodeCamp Classroom Used by teachers to track students' coding curriculum progress. Powers classrooms teaching freeCodeCamp's 10 million learners worldwide." [ref=e722] [cursor=pointer]:
                    - /url: https://github.com/freeCodeCamp/classroom/pull/366
                    - generic [ref=e723]: Added automated tests and testing framework support
                    - generic [ref=e724]: FreeCodeCamp Classroom
                    - generic [ref=e725]: Used by teachers to track students' coding curriculum progress. Powers classrooms teaching freeCodeCamp's 10 million learners worldwide.
                  - link "CASCADEGUARD AI Bakir Dawood" [ref=e728] [cursor=pointer]:
                    - /url: https://showcase.codeday.org/project/cmpjhn3eq59139j1myjm1doj8y
                    - generic [ref=e730]:
                      - text: CASCADEGUARD AI
                      - generic [ref=e731]: Bakir Dawood
                  - link "Updated example to include CSS and modern Mapbox. VisGL Deck Used to visualize large geospatial datasets on interactive maps. Uber built its entire geospatial visualization stack on it." [ref=e734] [cursor=pointer]:
                    - /url: https://github.com/visgl/deck.gl/pull/8026
                    - generic [ref=e735]: Updated example to include CSS and modern Mapbox.
                    - generic [ref=e736]: VisGL Deck
                    - generic [ref=e737]: Used to visualize large geospatial datasets on interactive maps. Uber built its entire geospatial visualization stack on it.
                  - link "Renamed refresh label to Refresh Daily Readings. OpenEnergyDashboard Used by campuses to visualize building energy meter data. Powers energy dashboards across dozens of university campuses." [ref=e740] [cursor=pointer]:
                    - /url: https://github.com/OpenEnergyDashboard/OED/pull/852
                    - generic [ref=e741]: Renamed refresh label to Refresh Daily Readings.
                    - generic [ref=e742]: OpenEnergyDashboard
                    - generic [ref=e743]: Used by campuses to visualize building energy meter data. Powers energy dashboards across dozens of university campuses.
                  - link "Added UI for reusable path variables. Hoppscotch Used by developers to test and debug web APIs. Sixty-thousand GitHub stars; Postman alternative for millions of developers." [ref=e746] [cursor=pointer]:
                    - /url: https://github.com/hoppscotch/hoppscotch/pull/2575
                    - generic [ref=e747]: Added UI for reusable path variables.
                    - generic [ref=e748]: Hoppscotch
                    - generic [ref=e749]: Used by developers to test and debug web APIs. Sixty-thousand GitHub stars; Postman alternative for millions of developers.
                  - link "Frequency 2004 – A Retro Social Network Reimagined Ansh Mishra" [ref=e752] [cursor=pointer]:
                    - /url: https://showcase.codeday.org/project/cmrhpjyv6734154j1myi70222rz
                    - generic [ref=e754]:
                      - text: Frequency 2004 – A Retro Social Network Reimagined
                      - generic [ref=e755]: Ansh Mishra
                  - link "Prevented serialization of ScriptFunction by raising exception Pytorch Used to train and deploy deep learning models in production. Powers ChatGPT, Tesla Autopilot, and most AI research." [ref=e758] [cursor=pointer]:
                    - /url: https://github.com/pytorch/pytorch/pull/61381
                    - generic [ref=e759]: Prevented serialization of ScriptFunction by raising exception
                    - generic [ref=e760]: Pytorch
                    - generic [ref=e761]: Used to train and deploy deep learning models in production. Powers ChatGPT, Tesla Autopilot, and most AI research.
                  - link "Time Capsule Suryansh Kumar" [ref=e764] [cursor=pointer]:
                    - /url: https://showcase.codeday.org/project/cmrhpin8z733174j1mym1qq2e5d
                    - generic [ref=e766]:
                      - text: Time Capsule
                      - generic [ref=e767]: Suryansh Kumar
                  - link "BadBoy500 Akshat Pande" [ref=e770] [cursor=pointer]:
                    - /url: https://showcase.codeday.org/project/cmrhpm01l735693j1mywdggcr06
                    - generic [ref=e772]:
                      - text: BadBoy500
                      - generic [ref=e773]: Akshat Pande
                  - link "Removed the interactive documentation command from the command-line tool. Fastify Used to build fast Node.js backend APIs and microservices. Powers Microsoft, IBM, and Amazon; 10M+ weekly downloads." [ref=e776] [cursor=pointer]:
                    - /url: https://github.com/fastify/fastify-cli/pull/462
                    - generic [ref=e777]: Removed the interactive documentation command from the command-line tool.
                    - generic [ref=e778]: Fastify
                    - generic [ref=e779]: Used to build fast Node.js backend APIs and microservices. Powers Microsoft, IBM, and Amazon; 10M+ weekly downloads.
                  - link "Added min and max error bars to graphs OpenEnergyDashboard Used by campuses to visualize building energy meter data. Powers energy dashboards across dozens of university campuses." [ref=e782] [cursor=pointer]:
                    - /url: https://github.com/OpenEnergyDashboard/OED/pull/975
                    - generic [ref=e783]: Added min and max error bars to graphs
                    - generic [ref=e784]: OpenEnergyDashboard
                    - generic [ref=e785]: Used by campuses to visualize building energy meter data. Powers energy dashboards across dozens of university campuses.
                  - link "Pokémon TOP DOWN GAME Hazeem" [ref=e788] [cursor=pointer]:
                    - /url: https://showcase.codeday.org/project/cmpjim0i279562j1myp3dzlamg
                    - generic [ref=e790]:
                      - text: Pokémon TOP DOWN GAME
                      - generic [ref=e791]: Hazeem
                  - 'link "Chaos Quiz: The Fragile App Burhan Hamid" [ref=e794] [cursor=pointer]':
                    - /url: https://showcase.codeday.org/project/cmpji3rkt66326j1myipd6ph2f
                    - generic [ref=e796]:
                      - text: "Chaos Quiz: The Fragile App"
                      - generic [ref=e797]: Burhan Hamid
              - generic [ref=e799]:
                - generic [ref=e801]:
                  - link "Lala Land Yash Singh" [ref=e804] [cursor=pointer]:
                    - /url: https://showcase.codeday.org/project/cmrhpvmnd744188j1myc0o9ml6j
                    - generic [ref=e806]:
                      - text: Lala Land
                      - generic [ref=e807]: Yash Singh
                  - link "Brain Chain Quiz Ifham" [ref=e810] [cursor=pointer]:
                    - /url: https://showcase.codeday.org/project/cmpjhpt2460137j1myqcamo9at
                    - generic [ref=e812]:
                      - text: Brain Chain Quiz
                      - generic [ref=e813]: Ifham
                  - link "Enabled CSV text translation on the server for multiple languages. OpenEnergyDashboard Used by campuses to visualize building energy meter data. Powers energy dashboards across dozens of university campuses." [ref=e816] [cursor=pointer]:
                    - /url: https://github.com/OpenEnergyDashboard/OED/pull/866
                    - generic [ref=e817]: Enabled CSV text translation on the server for multiple languages.
                    - generic [ref=e818]: OpenEnergyDashboard
                    - generic [ref=e819]: Used by campuses to visualize building energy meter data. Powers energy dashboards across dozens of university campuses.
                  - link "Added an option to exclude specific resources from plans Terraform Used by engineers to provision cloud infrastructure as code. Provisions cloud infrastructure for most Fortune 500 companies." [ref=e822] [cursor=pointer]:
                    - /url: https://github.com/hashicorp/terraform/pull/30041
                    - generic [ref=e823]: Added an option to exclude specific resources from plans
                    - generic [ref=e824]: Terraform
                    - generic [ref=e825]: Used by engineers to provision cloud infrastructure as code. Provisions cloud infrastructure for most Fortune 500 companies.
                  - link "DeedeeOS Saurabh Tiwari" [ref=e828] [cursor=pointer]:
                    - /url: https://showcase.codeday.org/project/cmrhpl3hk734876j1mytmhk1by1
                    - generic [ref=e830]:
                      - text: DeedeeOS
                      - generic [ref=e831]: Saurabh Tiwari
                  - link "The Game Inversion Om Rajput" [ref=e834] [cursor=pointer]:
                    - /url: https://showcase.codeday.org/project/cmrhpwdip745000j1mynygki9cu
                    - generic [ref=e836]:
                      - text: The Game Inversion
                      - generic [ref=e837]: Om Rajput
                  - link "Centered hero text on small screens. codeday/www-event Powers registration websites for youth coding hackathon events. Powers CodeDay hackathons reaching 100,000+ student coders worldwide." [ref=e840] [cursor=pointer]:
                    - /url: https://github.com/codeday/www-event/pull/40
                    - generic [ref=e841]: Centered hero text on small screens.
                    - generic [ref=e842]: codeday/www-event
                    - generic [ref=e843]: Powers registration websites for youth coding hackathon events. Powers CodeDay hackathons reaching 100,000+ student coders worldwide.
                  - link "Added create list button and renamed lists My Lists OpenLibrary Used by libraries to catalog and lend digital books. Catalogs every book ever published, powering Wikipedia citations." [ref=e846] [cursor=pointer]:
                    - /url: https://github.com/internetarchive/openlibrary/pull/7553
                    - generic [ref=e847]: Added create list button and renamed lists My Lists
                    - generic [ref=e848]: OpenLibrary
                    - generic [ref=e849]: Used by libraries to catalog and lend digital books. Catalogs every book ever published, powering Wikipedia citations.
                  - link "Ashes Of Tomorrow Ahmad Zargar" [ref=e852] [cursor=pointer]:
                    - /url: https://showcase.codeday.org/project/cmpjhlhrc58105j1mybsury8od
                    - generic [ref=e854]:
                      - text: Ashes Of Tomorrow
                      - generic [ref=e855]: Ahmad Zargar
                  - link "Added warning when unsupported components were called. Pytorch Used to train and deploy deep learning models in production. Powers ChatGPT, Tesla Autopilot, and most AI research." [ref=e858] [cursor=pointer]:
                    - /url: https://github.com/pytorch/pytorch/pull/125053
                    - generic [ref=e859]: Added warning when unsupported components were called.
                    - generic [ref=e860]: Pytorch
                    - generic [ref=e861]: Used to train and deploy deep learning models in production. Powers ChatGPT, Tesla Autopilot, and most AI research.
                  - link "bambai meri jaan Misbah K" [ref=e864] [cursor=pointer]:
                    - /url: https://showcase.codeday.org/project/cmrgnhpdl1387091j1myghgpx21q
                    - generic [ref=e866]:
                      - text: bambai meri jaan
                      - generic [ref=e867]: Misbah K
                  - link "Re:Wind Atharv Agarwal" [ref=e870] [cursor=pointer]:
                    - /url: https://showcase.codeday.org/project/cmrhpjc3m733740j1my9kzcn4vr
                    - generic [ref=e872]:
                      - text: Re:Wind
                      - generic [ref=e873]: Atharv Agarwal
                  - link "snake game Mayesha junaid" [ref=e876] [cursor=pointer]:
                    - /url: https://showcase.codeday.org/project/cmpjhzj7063650j1my2j8srz4h
                    - generic [ref=e878]:
                      - text: snake game
                      - generic [ref=e879]: Mayesha junaid
                  - link "RePlate lite Syed liyaqat" [ref=e882] [cursor=pointer]:
                    - /url: https://showcase.codeday.org/project/cmpkrjc5z728521j1mypl0j0brt
                    - generic [ref=e884]:
                      - text: RePlate lite
                      - generic [ref=e885]: Syed liyaqat
                  - link "Added ability to tag files across cloud providers Firefiles Used to self-host a Dropbox-like UI over cloud storage buckets. Turns any cloud bucket into self-hosted Dropbox" [ref=e888] [cursor=pointer]:
                    - /url: https://github.com/faisalsayed10/firefiles/pull/63
                    - generic [ref=e889]: Added ability to tag files across cloud providers
                    - generic [ref=e890]: Firefiles
                    - generic [ref=e891]: Used to self-host a Dropbox-like UI over cloud storage buckets. Turns any cloud bucket into self-hosted Dropbox
                  - link "Enabled deletion of stored URLs and auto-created storage directories kamaln7/klein Used to self-host branded short links for teams. Self-hosted URL shortener powering DigitalOcean engineers' internal links." [ref=e894] [cursor=pointer]:
                    - /url: https://github.com/kamaln7/klein/pull/32
                    - generic [ref=e895]: Enabled deletion of stored URLs and auto-created storage directories
                    - generic [ref=e896]: kamaln7/klein
                    - generic [ref=e897]: Used to self-host branded short links for teams. Self-hosted URL shortener powering DigitalOcean engineers' internal links.
                  - link "Added automatic supplying of inputs to web routes Robyn Used to build fast Python web APIs and microservices. Rust-powered Python web framework nearing two million downloads." [ref=e900] [cursor=pointer]:
                    - /url: https://github.com/sparckles/robyn/pull/569
                    - generic [ref=e901]: Added automatic supplying of inputs to web routes
                    - generic [ref=e902]: Robyn
                    - generic [ref=e903]: Used to build fast Python web APIs and microservices. Rust-powered Python web framework nearing two million downloads.
                  - link "A90sKid Aditya Singh" [ref=e906] [cursor=pointer]:
                    - /url: https://showcase.codeday.org/project/cmrhptjcr742582j1mybdvfemjk
                    - generic [ref=e908]:
                      - text: A90sKid
                      - generic [ref=e909]: Aditya Singh
                  - link "Retro Blocks Divya dev" [ref=e912] [cursor=pointer]:
                    - /url: https://showcase.codeday.org/project/cmrhpxvgq746626j1my8sqnhwz8
                    - generic [ref=e914]:
                      - text: Retro Blocks
                      - generic [ref=e915]: Divya dev
                  - link "Lala Land Yash Singh" [ref=e918] [cursor=pointer]:
                    - /url: https://showcase.codeday.org/project/cmrhpvmnd744188j1myc0o9ml6j
                    - generic [ref=e920]:
                      - text: Lala Land
                      - generic [ref=e921]: Yash Singh
                  - link "Brain Chain Quiz Ifham" [ref=e924] [cursor=pointer]:
                    - /url: https://showcase.codeday.org/project/cmpjhpt2460137j1myqcamo9at
                    - generic [ref=e926]:
                      - text: Brain Chain Quiz
                      - generic [ref=e927]: Ifham
                  - link "Enabled CSV text translation on the server for multiple languages. OpenEnergyDashboard Used by campuses to visualize building energy meter data. Powers energy dashboards across dozens of university campuses." [ref=e930] [cursor=pointer]:
                    - /url: https://github.com/OpenEnergyDashboard/OED/pull/866
                    - generic [ref=e931]: Enabled CSV text translation on the server for multiple languages.
                    - generic [ref=e932]: OpenEnergyDashboard
                    - generic [ref=e933]: Used by campuses to visualize building energy meter data. Powers energy dashboards across dozens of university campuses.
                  - link "Added an option to exclude specific resources from plans Terraform Used by engineers to provision cloud infrastructure as code. Provisions cloud infrastructure for most Fortune 500 companies." [ref=e936] [cursor=pointer]:
                    - /url: https://github.com/hashicorp/terraform/pull/30041
                    - generic [ref=e937]: Added an option to exclude specific resources from plans
                    - generic [ref=e938]: Terraform
                    - generic [ref=e939]: Used by engineers to provision cloud infrastructure as code. Provisions cloud infrastructure for most Fortune 500 companies.
                  - link "DeedeeOS Saurabh Tiwari" [ref=e942] [cursor=pointer]:
                    - /url: https://showcase.codeday.org/project/cmrhpl3hk734876j1mytmhk1by1
                    - generic [ref=e944]:
                      - text: DeedeeOS
                      - generic [ref=e945]: Saurabh Tiwari
                  - link "The Game Inversion Om Rajput" [ref=e948] [cursor=pointer]:
                    - /url: https://showcase.codeday.org/project/cmrhpwdip745000j1mynygki9cu
                    - generic [ref=e950]:
                      - text: The Game Inversion
                      - generic [ref=e951]: Om Rajput
                  - link "Centered hero text on small screens. codeday/www-event Powers registration websites for youth coding hackathon events. Powers CodeDay hackathons reaching 100,000+ student coders worldwide." [ref=e954] [cursor=pointer]:
                    - /url: https://github.com/codeday/www-event/pull/40
                    - generic [ref=e955]: Centered hero text on small screens.
                    - generic [ref=e956]: codeday/www-event
                    - generic [ref=e957]: Powers registration websites for youth coding hackathon events. Powers CodeDay hackathons reaching 100,000+ student coders worldwide.
                  - link "Added create list button and renamed lists My Lists OpenLibrary Used by libraries to catalog and lend digital books. Catalogs every book ever published, powering Wikipedia citations." [ref=e960] [cursor=pointer]:
                    - /url: https://github.com/internetarchive/openlibrary/pull/7553
                    - generic [ref=e961]: Added create list button and renamed lists My Lists
                    - generic [ref=e962]: OpenLibrary
                    - generic [ref=e963]: Used by libraries to catalog and lend digital books. Catalogs every book ever published, powering Wikipedia citations.
                  - link "Ashes Of Tomorrow Ahmad Zargar" [ref=e966] [cursor=pointer]:
                    - /url: https://showcase.codeday.org/project/cmpjhlhrc58105j1mybsury8od
                    - generic [ref=e968]:
                      - text: Ashes Of Tomorrow
                      - generic [ref=e969]: Ahmad Zargar
                  - link "Added warning when unsupported components were called. Pytorch Used to train and deploy deep learning models in production. Powers ChatGPT, Tesla Autopilot, and most AI research." [ref=e972] [cursor=pointer]:
                    - /url: https://github.com/pytorch/pytorch/pull/125053
                    - generic [ref=e973]: Added warning when unsupported components were called.
                    - generic [ref=e974]: Pytorch
                    - generic [ref=e975]: Used to train and deploy deep learning models in production. Powers ChatGPT, Tesla Autopilot, and most AI research.
                  - link "bambai meri jaan Misbah K" [ref=e978] [cursor=pointer]:
                    - /url: https://showcase.codeday.org/project/cmrgnhpdl1387091j1myghgpx21q
                    - generic [ref=e980]:
                      - text: bambai meri jaan
                      - generic [ref=e981]: Misbah K
                  - link "Re:Wind Atharv Agarwal" [ref=e984] [cursor=pointer]:
                    - /url: https://showcase.codeday.org/project/cmrhpjc3m733740j1my9kzcn4vr
                    - generic [ref=e986]:
                      - text: Re:Wind
                      - generic [ref=e987]: Atharv Agarwal
                  - link "snake game Mayesha junaid" [ref=e990] [cursor=pointer]:
                    - /url: https://showcase.codeday.org/project/cmpjhzj7063650j1my2j8srz4h
                    - generic [ref=e992]:
                      - text: snake game
                      - generic [ref=e993]: Mayesha junaid
                  - link "RePlate lite Syed liyaqat" [ref=e996] [cursor=pointer]:
                    - /url: https://showcase.codeday.org/project/cmpkrjc5z728521j1mypl0j0brt
                    - generic [ref=e998]:
                      - text: RePlate lite
                      - generic [ref=e999]: Syed liyaqat
                  - link "Added ability to tag files across cloud providers Firefiles Used to self-host a Dropbox-like UI over cloud storage buckets. Turns any cloud bucket into self-hosted Dropbox" [ref=e1002] [cursor=pointer]:
                    - /url: https://github.com/faisalsayed10/firefiles/pull/63
                    - generic [ref=e1003]: Added ability to tag files across cloud providers
                    - generic [ref=e1004]: Firefiles
                    - generic [ref=e1005]: Used to self-host a Dropbox-like UI over cloud storage buckets. Turns any cloud bucket into self-hosted Dropbox
                  - link "Enabled deletion of stored URLs and auto-created storage directories kamaln7/klein Used to self-host branded short links for teams. Self-hosted URL shortener powering DigitalOcean engineers' internal links." [ref=e1008] [cursor=pointer]:
                    - /url: https://github.com/kamaln7/klein/pull/32
                    - generic [ref=e1009]: Enabled deletion of stored URLs and auto-created storage directories
                    - generic [ref=e1010]: kamaln7/klein
                    - generic [ref=e1011]: Used to self-host branded short links for teams. Self-hosted URL shortener powering DigitalOcean engineers' internal links.
                  - link "Added automatic supplying of inputs to web routes Robyn Used to build fast Python web APIs and microservices. Rust-powered Python web framework nearing two million downloads." [ref=e1014] [cursor=pointer]:
                    - /url: https://github.com/sparckles/robyn/pull/569
                    - generic [ref=e1015]: Added automatic supplying of inputs to web routes
                    - generic [ref=e1016]: Robyn
                    - generic [ref=e1017]: Used to build fast Python web APIs and microservices. Rust-powered Python web framework nearing two million downloads.
                  - link "A90sKid Aditya Singh" [ref=e1020] [cursor=pointer]:
                    - /url: https://showcase.codeday.org/project/cmrhptjcr742582j1mybdvfemjk
                    - generic [ref=e1022]:
                      - text: A90sKid
                      - generic [ref=e1023]: Aditya Singh
                  - link "Retro Blocks Divya dev" [ref=e1026] [cursor=pointer]:
                    - /url: https://showcase.codeday.org/project/cmrhpxvgq746626j1my8sqnhwz8
                    - generic [ref=e1028]:
                      - text: Retro Blocks
                      - generic [ref=e1029]: Divya dev
                - generic [ref=e1030]:
                  - link "Lala Land Yash Singh" [ref=e1033] [cursor=pointer]:
                    - /url: https://showcase.codeday.org/project/cmrhpvmnd744188j1myc0o9ml6j
                    - generic [ref=e1035]:
                      - text: Lala Land
                      - generic [ref=e1036]: Yash Singh
                  - link "Brain Chain Quiz Ifham" [ref=e1039] [cursor=pointer]:
                    - /url: https://showcase.codeday.org/project/cmpjhpt2460137j1myqcamo9at
                    - generic [ref=e1041]:
                      - text: Brain Chain Quiz
                      - generic [ref=e1042]: Ifham
                  - link "Enabled CSV text translation on the server for multiple languages. OpenEnergyDashboard Used by campuses to visualize building energy meter data. Powers energy dashboards across dozens of university campuses." [ref=e1045] [cursor=pointer]:
                    - /url: https://github.com/OpenEnergyDashboard/OED/pull/866
                    - generic [ref=e1046]: Enabled CSV text translation on the server for multiple languages.
                    - generic [ref=e1047]: OpenEnergyDashboard
                    - generic [ref=e1048]: Used by campuses to visualize building energy meter data. Powers energy dashboards across dozens of university campuses.
                  - link "Added an option to exclude specific resources from plans Terraform Used by engineers to provision cloud infrastructure as code. Provisions cloud infrastructure for most Fortune 500 companies." [ref=e1051] [cursor=pointer]:
                    - /url: https://github.com/hashicorp/terraform/pull/30041
                    - generic [ref=e1052]: Added an option to exclude specific resources from plans
                    - generic [ref=e1053]: Terraform
                    - generic [ref=e1054]: Used by engineers to provision cloud infrastructure as code. Provisions cloud infrastructure for most Fortune 500 companies.
                  - link "DeedeeOS Saurabh Tiwari" [ref=e1057] [cursor=pointer]:
                    - /url: https://showcase.codeday.org/project/cmrhpl3hk734876j1mytmhk1by1
                    - generic [ref=e1059]:
                      - text: DeedeeOS
                      - generic [ref=e1060]: Saurabh Tiwari
                  - link "The Game Inversion Om Rajput" [ref=e1063] [cursor=pointer]:
                    - /url: https://showcase.codeday.org/project/cmrhpwdip745000j1mynygki9cu
                    - generic [ref=e1065]:
                      - text: The Game Inversion
                      - generic [ref=e1066]: Om Rajput
                  - link "Centered hero text on small screens. codeday/www-event Powers registration websites for youth coding hackathon events. Powers CodeDay hackathons reaching 100,000+ student coders worldwide." [ref=e1069] [cursor=pointer]:
                    - /url: https://github.com/codeday/www-event/pull/40
                    - generic [ref=e1070]: Centered hero text on small screens.
                    - generic [ref=e1071]: codeday/www-event
                    - generic [ref=e1072]: Powers registration websites for youth coding hackathon events. Powers CodeDay hackathons reaching 100,000+ student coders worldwide.
                  - link "Added create list button and renamed lists My Lists OpenLibrary Used by libraries to catalog and lend digital books. Catalogs every book ever published, powering Wikipedia citations." [ref=e1075] [cursor=pointer]:
                    - /url: https://github.com/internetarchive/openlibrary/pull/7553
                    - generic [ref=e1076]: Added create list button and renamed lists My Lists
                    - generic [ref=e1077]: OpenLibrary
                    - generic [ref=e1078]: Used by libraries to catalog and lend digital books. Catalogs every book ever published, powering Wikipedia citations.
                  - link "Ashes Of Tomorrow Ahmad Zargar" [ref=e1081] [cursor=pointer]:
                    - /url: https://showcase.codeday.org/project/cmpjhlhrc58105j1mybsury8od
                    - generic [ref=e1083]:
                      - text: Ashes Of Tomorrow
                      - generic [ref=e1084]: Ahmad Zargar
                  - link "Added warning when unsupported components were called. Pytorch Used to train and deploy deep learning models in production. Powers ChatGPT, Tesla Autopilot, and most AI research." [ref=e1087] [cursor=pointer]:
                    - /url: https://github.com/pytorch/pytorch/pull/125053
                    - generic [ref=e1088]: Added warning when unsupported components were called.
                    - generic [ref=e1089]: Pytorch
                    - generic [ref=e1090]: Used to train and deploy deep learning models in production. Powers ChatGPT, Tesla Autopilot, and most AI research.
                  - link "bambai meri jaan Misbah K" [ref=e1093] [cursor=pointer]:
                    - /url: https://showcase.codeday.org/project/cmrgnhpdl1387091j1myghgpx21q
                    - generic [ref=e1095]:
                      - text: bambai meri jaan
                      - generic [ref=e1096]: Misbah K
                  - link "Re:Wind Atharv Agarwal" [ref=e1099] [cursor=pointer]:
                    - /url: https://showcase.codeday.org/project/cmrhpjc3m733740j1my9kzcn4vr
                    - generic [ref=e1101]:
                      - text: Re:Wind
                      - generic [ref=e1102]: Atharv Agarwal
                  - link "snake game Mayesha junaid" [ref=e1105] [cursor=pointer]:
                    - /url: https://showcase.codeday.org/project/cmpjhzj7063650j1my2j8srz4h
                    - generic [ref=e1107]:
                      - text: snake game
                      - generic [ref=e1108]: Mayesha junaid
                  - link "RePlate lite Syed liyaqat" [ref=e1111] [cursor=pointer]:
                    - /url: https://showcase.codeday.org/project/cmpkrjc5z728521j1mypl0j0brt
                    - generic [ref=e1113]:
                      - text: RePlate lite
                      - generic [ref=e1114]: Syed liyaqat
                  - link "Added ability to tag files across cloud providers Firefiles Used to self-host a Dropbox-like UI over cloud storage buckets. Turns any cloud bucket into self-hosted Dropbox" [ref=e1117] [cursor=pointer]:
                    - /url: https://github.com/faisalsayed10/firefiles/pull/63
                    - generic [ref=e1118]: Added ability to tag files across cloud providers
                    - generic [ref=e1119]: Firefiles
                    - generic [ref=e1120]: Used to self-host a Dropbox-like UI over cloud storage buckets. Turns any cloud bucket into self-hosted Dropbox
                  - link "Enabled deletion of stored URLs and auto-created storage directories kamaln7/klein Used to self-host branded short links for teams. Self-hosted URL shortener powering DigitalOcean engineers' internal links." [ref=e1123] [cursor=pointer]:
                    - /url: https://github.com/kamaln7/klein/pull/32
                    - generic [ref=e1124]: Enabled deletion of stored URLs and auto-created storage directories
                    - generic [ref=e1125]: kamaln7/klein
                    - generic [ref=e1126]: Used to self-host branded short links for teams. Self-hosted URL shortener powering DigitalOcean engineers' internal links.
                  - link "Added automatic supplying of inputs to web routes Robyn Used to build fast Python web APIs and microservices. Rust-powered Python web framework nearing two million downloads." [ref=e1129] [cursor=pointer]:
                    - /url: https://github.com/sparckles/robyn/pull/569
                    - generic [ref=e1130]: Added automatic supplying of inputs to web routes
                    - generic [ref=e1131]: Robyn
                    - generic [ref=e1132]: Used to build fast Python web APIs and microservices. Rust-powered Python web framework nearing two million downloads.
                  - link "A90sKid Aditya Singh" [ref=e1135] [cursor=pointer]:
                    - /url: https://showcase.codeday.org/project/cmrhptjcr742582j1mybdvfemjk
                    - generic [ref=e1137]:
                      - text: A90sKid
                      - generic [ref=e1138]: Aditya Singh
                  - link "Retro Blocks Divya dev" [ref=e1141] [cursor=pointer]:
                    - /url: https://showcase.codeday.org/project/cmrhpxvgq746626j1my8sqnhwz8
                    - generic [ref=e1143]:
                      - text: Retro Blocks
                      - generic [ref=e1144]: Divya dev
                  - link "Lala Land Yash Singh" [ref=e1147] [cursor=pointer]:
                    - /url: https://showcase.codeday.org/project/cmrhpvmnd744188j1myc0o9ml6j
                    - generic [ref=e1149]:
                      - text: Lala Land
                      - generic [ref=e1150]: Yash Singh
                  - link "Brain Chain Quiz Ifham" [ref=e1153] [cursor=pointer]:
                    - /url: https://showcase.codeday.org/project/cmpjhpt2460137j1myqcamo9at
                    - generic [ref=e1155]:
                      - text: Brain Chain Quiz
                      - generic [ref=e1156]: Ifham
                  - link "Enabled CSV text translation on the server for multiple languages. OpenEnergyDashboard Used by campuses to visualize building energy meter data. Powers energy dashboards across dozens of university campuses." [ref=e1159] [cursor=pointer]:
                    - /url: https://github.com/OpenEnergyDashboard/OED/pull/866
                    - generic [ref=e1160]: Enabled CSV text translation on the server for multiple languages.
                    - generic [ref=e1161]: OpenEnergyDashboard
                    - generic [ref=e1162]: Used by campuses to visualize building energy meter data. Powers energy dashboards across dozens of university campuses.
                  - link "Added an option to exclude specific resources from plans Terraform Used by engineers to provision cloud infrastructure as code. Provisions cloud infrastructure for most Fortune 500 companies." [ref=e1165] [cursor=pointer]:
                    - /url: https://github.com/hashicorp/terraform/pull/30041
                    - generic [ref=e1166]: Added an option to exclude specific resources from plans
                    - generic [ref=e1167]: Terraform
                    - generic [ref=e1168]: Used by engineers to provision cloud infrastructure as code. Provisions cloud infrastructure for most Fortune 500 companies.
                  - link "DeedeeOS Saurabh Tiwari" [ref=e1171] [cursor=pointer]:
                    - /url: https://showcase.codeday.org/project/cmrhpl3hk734876j1mytmhk1by1
                    - generic [ref=e1173]:
                      - text: DeedeeOS
                      - generic [ref=e1174]: Saurabh Tiwari
                  - link "The Game Inversion Om Rajput" [ref=e1177] [cursor=pointer]:
                    - /url: https://showcase.codeday.org/project/cmrhpwdip745000j1mynygki9cu
                    - generic [ref=e1179]:
                      - text: The Game Inversion
                      - generic [ref=e1180]: Om Rajput
                  - link "Centered hero text on small screens. codeday/www-event Powers registration websites for youth coding hackathon events. Powers CodeDay hackathons reaching 100,000+ student coders worldwide." [ref=e1183] [cursor=pointer]:
                    - /url: https://github.com/codeday/www-event/pull/40
                    - generic [ref=e1184]: Centered hero text on small screens.
                    - generic [ref=e1185]: codeday/www-event
                    - generic [ref=e1186]: Powers registration websites for youth coding hackathon events. Powers CodeDay hackathons reaching 100,000+ student coders worldwide.
                  - link "Added create list button and renamed lists My Lists OpenLibrary Used by libraries to catalog and lend digital books. Catalogs every book ever published, powering Wikipedia citations." [ref=e1189] [cursor=pointer]:
                    - /url: https://github.com/internetarchive/openlibrary/pull/7553
                    - generic [ref=e1190]: Added create list button and renamed lists My Lists
                    - generic [ref=e1191]: OpenLibrary
                    - generic [ref=e1192]: Used by libraries to catalog and lend digital books. Catalogs every book ever published, powering Wikipedia citations.
                  - link "Ashes Of Tomorrow Ahmad Zargar" [ref=e1195] [cursor=pointer]:
                    - /url: https://showcase.codeday.org/project/cmpjhlhrc58105j1mybsury8od
                    - generic [ref=e1197]:
                      - text: Ashes Of Tomorrow
                      - generic [ref=e1198]: Ahmad Zargar
                  - link "Added warning when unsupported components were called. Pytorch Used to train and deploy deep learning models in production. Powers ChatGPT, Tesla Autopilot, and most AI research." [ref=e1201] [cursor=pointer]:
                    - /url: https://github.com/pytorch/pytorch/pull/125053
                    - generic [ref=e1202]: Added warning when unsupported components were called.
                    - generic [ref=e1203]: Pytorch
                    - generic [ref=e1204]: Used to train and deploy deep learning models in production. Powers ChatGPT, Tesla Autopilot, and most AI research.
                  - link "bambai meri jaan Misbah K" [ref=e1207] [cursor=pointer]:
                    - /url: https://showcase.codeday.org/project/cmrgnhpdl1387091j1myghgpx21q
                    - generic [ref=e1209]:
                      - text: bambai meri jaan
                      - generic [ref=e1210]: Misbah K
                  - link "Re:Wind Atharv Agarwal" [ref=e1213] [cursor=pointer]:
                    - /url: https://showcase.codeday.org/project/cmrhpjc3m733740j1my9kzcn4vr
                    - generic [ref=e1215]:
                      - text: Re:Wind
                      - generic [ref=e1216]: Atharv Agarwal
                  - link "snake game Mayesha junaid" [ref=e1219] [cursor=pointer]:
                    - /url: https://showcase.codeday.org/project/cmpjhzj7063650j1my2j8srz4h
                    - generic [ref=e1221]:
                      - text: snake game
                      - generic [ref=e1222]: Mayesha junaid
                  - link "RePlate lite Syed liyaqat" [ref=e1225] [cursor=pointer]:
                    - /url: https://showcase.codeday.org/project/cmpkrjc5z728521j1mypl0j0brt
                    - generic [ref=e1227]:
                      - text: RePlate lite
                      - generic [ref=e1228]: Syed liyaqat
                  - link "Added ability to tag files across cloud providers Firefiles Used to self-host a Dropbox-like UI over cloud storage buckets. Turns any cloud bucket into self-hosted Dropbox" [ref=e1231] [cursor=pointer]:
                    - /url: https://github.com/faisalsayed10/firefiles/pull/63
                    - generic [ref=e1232]: Added ability to tag files across cloud providers
                    - generic [ref=e1233]: Firefiles
                    - generic [ref=e1234]: Used to self-host a Dropbox-like UI over cloud storage buckets. Turns any cloud bucket into self-hosted Dropbox
                  - link "Enabled deletion of stored URLs and auto-created storage directories kamaln7/klein Used to self-host branded short links for teams. Self-hosted URL shortener powering DigitalOcean engineers' internal links." [ref=e1237] [cursor=pointer]:
                    - /url: https://github.com/kamaln7/klein/pull/32
                    - generic [ref=e1238]: Enabled deletion of stored URLs and auto-created storage directories
                    - generic [ref=e1239]: kamaln7/klein
                    - generic [ref=e1240]: Used to self-host branded short links for teams. Self-hosted URL shortener powering DigitalOcean engineers' internal links.
                  - link "Added automatic supplying of inputs to web routes Robyn Used to build fast Python web APIs and microservices. Rust-powered Python web framework nearing two million downloads." [ref=e1243] [cursor=pointer]:
                    - /url: https://github.com/sparckles/robyn/pull/569
                    - generic [ref=e1244]: Added automatic supplying of inputs to web routes
                    - generic [ref=e1245]: Robyn
                    - generic [ref=e1246]: Used to build fast Python web APIs and microservices. Rust-powered Python web framework nearing two million downloads.
                  - link "A90sKid Aditya Singh" [ref=e1249] [cursor=pointer]:
                    - /url: https://showcase.codeday.org/project/cmrhptjcr742582j1mybdvfemjk
                    - generic [ref=e1251]:
                      - text: A90sKid
                      - generic [ref=e1252]: Aditya Singh
                  - link "Retro Blocks Divya dev" [ref=e1255] [cursor=pointer]:
                    - /url: https://showcase.codeday.org/project/cmrhpxvgq746626j1my8sqnhwz8
                    - generic [ref=e1257]:
                      - text: Retro Blocks
                      - generic [ref=e1258]: Divya dev
            - generic [ref=e1259]:
              - generic [ref=e1260]: 37093 projects created at our events and online programs.
              - link "See more" [ref=e1261] [cursor=pointer]:
                - /url: https://showcase.codeday.org
          - generic [ref=e1265]:
            - heading "17 years of bringing meaningful work into education." [level=2] [ref=e1267]
            - generic [ref=e1269]:
              - generic [ref=e1270]: "CodeDay was founded in 2009 by a group of high school friends who wanted to bring meaningful work into education. The design has changed many times, but what students is the same: find something somebody needs, learn on their own, and build something that people will really use."
              - generic [ref=e1271]:
                - button "Show earlier events" [disabled] [ref=e1272]
                - generic [ref=e1275]:
                  - generic [ref=e1358]:
                    - generic [ref=e1359]: "2009"
                    - generic [ref=e1360]: "2014"
                    - generic [ref=e1361]: "2019"
                    - generic [ref=e1362]: "2024"
                    - generic [ref=e1363]: "2026"
                  - generic [ref=e1364]:
                    - generic [ref=e1365]:
                      - generic [ref=e1366]: April 2009
                      - generic [ref=e1367]: CodeDay founded (as "StudentRND")
                    - generic:
                      - generic: May 2010
                      - generic: Summer makerspace opens
                    - generic:
                      - generic: May 2011
                      - generic: Year-round makerspace opens
                    - generic:
                      - generic: December 2011
                      - generic: First CodeDay event
                    - generic:
                      - generic: November 2012
                      - generic: First CodeDay outside Seattle (in Portland)
                    - generic:
                      - generic: June 2013
                      - generic: First summer "CodeDay Labs" program
                    - generic:
                      - generic: January 2014
                      - generic: First worldwide weekend events
                    - generic:
                      - generic: February 2016
                      - generic: 40 cities running CodeDay events worldwide
                    - generic:
                      - generic: November 2017
                      - generic: Cybersecurity challenge (CTF) launches to help beginners learn about cybersecurity
                    - generic:
                      - generic: May 2018
                      - generic: Free laptops for low-income students program launches
                    - generic:
                      - generic: November 2019
                      - generic: Free transportation to in-person events launches for low-income students
                    - generic:
                      - generic: April 2020
                      - generic: First Virtual CodeDay
                    - generic:
                      - generic: June 2020
                      - generic: First open source summer program
                    - generic:
                      - generic: August 2021
                      - generic: In-person CodeDay events return
                    - generic:
                      - generic: October 2021
                      - generic: First open source micro-internships
                    - generic:
                      - generic: April 2022
                      - generic: First open-source college capstone
                - button "Show later events" [ref=e1368] [cursor=pointer]
        - generic [ref=e1372]:
          - generic [ref=e1375]:
            - heading "Everything we know about whether this works is public" [level=2] [ref=e1376]
            - generic [ref=e1377]: We study what we run and publish it where other researchers can take it apart. Independent evaluators have examined our programs, and independent economists have studied what happens to the students in them. When the evidence says the program is wrong, we change the program, even when that is expensive. It has been the same vision since 2009, and the design has changed many times.
            - link "Read the research" [ref=e1380] [cursor=pointer]:
              - /url: "#"
              - text: Read the research
              - generic [aria-hidden] [ref=e1381]: →
          - generic [ref=e1386]:
            - generic [ref=e1387]:
              - generic [ref=e1388]: Colleges
              - generic [ref=e1389]: "[Body copy for the Colleges row — not yet supplied]"
              - link "Learn more" [ref=e1391] [cursor=pointer]:
                - /url: "#"
            - generic [ref=e1395]:
              - generic [ref=e1396]: Companies and foundations
              - generic [ref=e1397]: "[Body copy for the Companies and foundations row — not yet supplied]"
              - link "Learn more" [ref=e1399] [cursor=pointer]:
                - /url: "#"
            - generic [ref=e1403]:
              - generic [ref=e1404]: Mentors
              - generic [ref=e1405]: "[Body copy for the Mentors row — not yet supplied]"
              - link "Learn more" [ref=e1407] [cursor=pointer]:
                - /url: "#"
            - generic [ref=e1411]:
              - generic [ref=e1412]: Maintainers
              - generic [ref=e1413]: "[Body copy for the Maintainers row — not yet supplied]"
              - link "Learn more" [ref=e1415] [cursor=pointer]:
                - /url: "#"
        - generic [ref=e1422]:
          - generic [ref=e1423]:
            - generic [ref=e1424]:
              - generic [ref=e1425]: Funders
              - generic [ref=e1426]:
                - link [ref=e1427] [cursor=pointer]:
                  - /url: https://risk.lexisnexis.com/about-us/social-responsibility
                  - img "LexisNexis Risk Solutions" [ref=e1429]
                - link [ref=e1430] [cursor=pointer]:
                  - /url: https://www.nsf.gov/
                  - img "U.S. National Science Foundation" [ref=e1432]
                - link [ref=e1433] [cursor=pointer]:
                  - /url: https://careerconnectwa.org/
                  - img "Career Connect Washington" [ref=e1435]
                - link [ref=e1436] [cursor=pointer]:
                  - /url: https://gaming.kinesis-ergo.com/
                  - img "Kinesis Gaming" [ref=e1438]
                - link [ref=e1439] [cursor=pointer]:
                  - /url: https://www.wsgr.com/
                  - img "Wilson Sonsini" [ref=e1441]
                - link [ref=e1442] [cursor=pointer]:
                  - /url: https://www.fastly.com/
                  - img "Fastly" [ref=e1444]
                - link [ref=e1445] [cursor=pointer]:
                  - /url: https://contentful.com/
                  - img "Contentful" [ref=e1447]
                - link [ref=e1448] [cursor=pointer]:
                  - /url: https://auth0.com/
                  - img "Auth0" [ref=e1450]
            - generic [ref=e1451]:
              - generic [ref=e1452]: Ratings
              - generic [ref=e1453]: Candid, Platinum Transparency 2025·Charity Navigator, four stars
            - generic [ref=e1454]:
              - generic [ref=e1455]: Press
              - generic [ref=e1456]:
                - generic [ref=e1457]: NPR All Things Considered
                - generic [ref=e1459]: TechCrunch
                - generic [ref=e1461]: GeekWire
                - generic [ref=e1463]: KQED
                - generic [ref=e1465]: ReadWrite
          - link "Support a student's seat" [ref=e1467] [cursor=pointer]:
            - /url: "#"
      - generic [ref=e1468]:
        - generic [ref=e1470]:
          - heading "Funding Statements and Disclaimers" [level=3] [ref=e1471]
          - generic [ref=e1472]: This material is based upon work supported by the National Science Foundation under Award Numbers 2347311, 2610216, and 2500828. Any opinions, findings and conclusions or recommendations expressed in this material are those of the author(s) and do not necessarily reflect the views of the National Science Foundation.
          - generic [ref=e1473]: CodeDay Events are supported by the U.S. Department of Labor – WIOA Title IB Adult, DW and Youth grants for PY23; a total of $138,826, or 65%, of the program is financed with federal funds, and $75,000, or 35%, is funded by other non-federal sources. Additionally, CodeDay Labs interview preparation programs are supported by the U.S. Department of Labor - WIOA Title IB Adult, DW and Youth grants for PY24/FY25; a total of $171,000, or 100%, of the program is financed with federal funds. Read more about USDOL grant funding at esd.wa.gov/usdol
          - generic [ref=e1474]: Netflix and the Netflix logo are trademarks of Netflix, Inc. Google and the Google logo are trademarks of Google LLC. Y Combinator and the Y Combinator logo are trademarks of Y Combinator Management, LLC. Apple and the Apple logo are trademarks of Apple Inc. Stripe and the Stripe logo are trademarks of Stripe, Inc. Anthropic and the Anthropic logo are trademarks of Anthropic, PBC. Spotify and the Spotify logo are trademarks of Spotify Technology S.A. Cloudflare and the Cloudflare logo are trademarks of Cloudflare, Inc. Microsoft and the Microsoft logo are trademarks of Microsoft Corporation. Airbnb and the Airbnb logo are trademarks of Airbnb, Inc. Uber and the Uber logo are trademarks of Uber Technologies, Inc. Nvidia and the Nvidia logo are trademarks of NVIDIA Corporation. Amazon and the Amazon logo are trademarks of Amazon.com, Inc. GitHub and the GitHub logo are trademarks of GitHub, Inc. Shopify and the Shopify logo are trademarks of Shopify Inc. Meta and the Meta logo are trademarks of Meta Platforms, Inc. OpenAI and the OpenAI logo are trademarks of OpenAI Group PBC. Midjourney and the Midjourney logo are trademarks of Midjourney, Inc. Adobe and the Adobe logo are trademarks of Adobe Inc. Bloomberg and the Bloomberg logo are trademarks of Bloomberg L.P. Snowflake and the Snowflake logo are trademarks of Snowflake Inc. Figma and the Figma logo are trademarks of Figma, Inc. Coinbase and the Coinbase logo are trademarks of Coinbase Global, Inc. Intel and the Intel logo are trademarks of Intel Corporation. Oracle and the Oracle logo are trademarks of Oracle Corporation. State Farm and the State Farm logo are trademarks of State Farm Mutual Automobile Insurance Company. Oak Ridge National Laboratory and the Oak Ridge National Laboratory logo are trademarks of UT-Battelle, LLC. Pacific Northwest National Laboratory and the Pacific Northwest National Laboratory logo are trademarks of Battelle Memorial Institute. Docusign and the Docusign logo are trademarks of Docusign, Inc. T-Mobile and the T-Mobile logo are trademarks of T-Mobile US, Inc. HBO and the HBO logo are trademarks of Home Box Office, Inc. PACCAR and the PACCAR logo are trademarks of PACCAR Inc. Costco and the Costco logo are trademarks of Costco Wholesale Corporation. Alaska Airlines and the Alaska Airlines logo are trademarks of Alaska Airlines, Inc. Tesla and the Tesla logo are trademarks of Tesla, Inc. SpaceX and the SpaceX logo are trademarks of Space Exploration Technologies Corp.
        - contentinfo [ref=e1475]:
          - link "This website is open source software maintained with ♡ by Lola Egherman" [ref=e1477] [cursor=pointer]:
            - /url: https://github.com/codeday/web
            - generic [ref=e1478]: This website is open source software maintained with ♡ by
            - generic [ref=e1479]: Lola Egherman
          - generic [ref=e1480]:
            - generic [ref=e1481]:
              - generic [ref=e1483]:
                - text: "© 2026 Student Research and Development. All rights reserved.A 501(c)(3) non-profit. US EIN:"
                - textbox "US EIN:" [ref=e1484]: 26-4742589
                - link "+1 (888) 607-7763" [ref=e1485] [cursor=pointer]:
                  - /url: tel:18886077763
              - generic [ref=e1486]:
                - link "Terms of Service" [ref=e1487] [cursor=pointer]:
                  - /url: /legal/tos
                - link "Privacy Policy" [ref=e1488] [cursor=pointer]:
                  - /url: /legal/privacy
                - link "Cookie Policy" [ref=e1489] [cursor=pointer]:
                  - /url: /legal/cookies
                - link "Disclaimer" [ref=e1490] [cursor=pointer]:
                  - /url: /legal/disclaimer
                - link "Do Not Sell My Info" [ref=e1491] [cursor=pointer]:
                  - /url: /privacy/controls
                - generic [ref=e1492] [cursor=pointer]: Privacy Settings
            - generic [ref=e1494]:
              - heading "Resources" [level=2] [ref=e1495]
              - list [ref=e1496]:
                - listitem [ref=e1497]:
                  - link "Jobs" [ref=e1498] [cursor=pointer]:
                    - /url: https://app.dover.com/jobs/codeday
                - listitem [ref=e1499]:
                  - link "Shop" [ref=e1500] [cursor=pointer]:
                    - /url: https://shop.codeday.org/
                - listitem [ref=e1501]:
                  - link "Account Log-in" [ref=e1502] [cursor=pointer]:
                    - /url: https://account.codeday.org/
                - listitem [ref=e1503]:
                  - link "FAQs & Help" [ref=e1504] [cursor=pointer]:
                    - /url: /help
                - listitem [ref=e1505]:
                  - link "Code of Conduct" [ref=e1506] [cursor=pointer]:
                    - /url: /conduct
                - listitem [ref=e1507]:
                  - link "Blog" [ref=e1508] [cursor=pointer]:
                    - /url: https://blog.codeday.org/
    - region "Notifications, top-end (alt+T)"
  - alert [ref=e1509]
```

# Test source

```ts
  75  |   const context = await browser.newContext({ javaScriptEnabled: false });
  76  |   const page = await context.newPage();
  77  |   await page.goto(`http://localhost:4400${PATH}`);
  78  |   for (const marker of SECTION_MARKERS) {
  79  |     await expect(page.getByText(marker, { exact: false }).first()).toBeVisible();
  80  |   }
  81  |   // A link (the hero action) must be present and real, not JS-hydrated in.
  82  |   await expect(page.getByRole("link", { name: "See where they started" })).toBeVisible();
  83  |   await context.close();
  84  | });
  85  | 
  86  | test("every CreditLists logo has its organisation name as alt", async ({ page }) => {
  87  |   await page.goto(PATH);
  88  |   const names = [
  89  |     "National Science Foundation (Award No. 2347311)",
  90  |     "LexisNexis Risk Solutions",
  91  |     "Career Connect Washington",
  92  |     "Wilson Sonsini",
  93  |     "Fastly",
  94  |     "Contentful",
  95  |     "Auth0",
  96  |     "Kinesis Gaming",
  97  |   ];
  98  |   for (const name of names) {
  99  |     await expect(page.locator(`img[alt="${name}"]`)).toHaveCount(1);
  100 |   }
  101 | });
  102 | 
  103 | test("meta description no longer uses the old CMS mission sentence", async ({ page }) => {
  104 |   await page.goto(PATH);
  105 |   const description = await page.locator('meta[name="description"]').getAttribute("content");
  106 |   expect(description).toBeTruthy();
  107 |   expect(description).not.toContain(
  108 |     "Helping students use technology and creativity to work on meaningful problems and create a more innovative future.",
  109 |   );
  110 |   const og = await page.locator('meta[property="og:description"]').getAttribute("content");
  111 |   expect(og).not.toContain(
  112 |     "Helping students use technology and creativity to work on meaningful problems and create a more innovative future.",
  113 |   );
  114 | });
  115 | 
  116 | test("the margin index is gone — 'For partners' appears exactly once, not per-section", async ({
  117 |   page,
  118 | }) => {
  119 |   await page.goto(PATH);
  120 |   const count = await page.getByText("For partners", { exact: true }).count();
  121 |   expect(count).toBe(1);
  122 |   // None of the removed per-section words should appear anywhere as their
  123 |   // own standalone eyebrow-style element any more.
  124 |   for (const removed of ["The arc", "Formats", "The field", "Since 2009", "Merged"]) {
  125 |     await expect(page.getByText(removed, { exact: true })).toHaveCount(0);
  126 |   }
  127 | });
  128 | 
  129 | test("StatTrio renders — figures pending, but the section is on the page", async ({ page }) => {
  130 |   await page.goto(PATH);
  131 |   await expect(page.getByText("Students have done at least one CodeDay since 2009")).toBeVisible();
  132 |   await expect(page.getByText("[N]", { exact: true }).first()).toBeVisible();
  133 | });
  134 | 
  135 | test("StatTrio (the stats block) sits directly under the alumni photos, and FormatCards/'why this matters' follow", async ({
  136 |   page,
  137 | }) => {
  138 |   await page.goto(PATH);
  139 |   const text = await page.locator("main, body").first().innerText();
  140 |   const studentExamplesIndex = text.indexOf("2013");
  141 |   const statsIndex = text.indexOf("Students have done at least one CodeDay since 2009");
  142 |   const formatsIndex = text.indexOf("The only thing that moves you along is what you finished.");
  143 |   const whyMattersIndex = text.indexOf("Why this matters more than it did five years ago");
  144 |   expect(studentExamplesIndex).toBeGreaterThan(-1);
  145 |   expect(statsIndex).toBeGreaterThan(studentExamplesIndex);
  146 |   expect(formatsIndex).toBeGreaterThan(statsIndex);
  147 |   expect(whyMattersIndex).toBeGreaterThan(formatsIndex);
  148 | });
  149 | 
  150 | test("the gap between the alumni photos section and the StatTrio section is tighter than a normal section gap", async ({
  151 |   page,
  152 | }) => {
  153 |   await page.goto(PATH);
  154 |   // Measuring the boundary between the two <section> elements themselves —
  155 |   // not into StatTrio's own internal card padding above its label, which
  156 |   // is a separate, larger distance that has nothing to do with the
  157 |   // between-SECTIONS spacing this test is about.
  158 |   const gap = await page.evaluate(() => {
  159 |     const wallSection = document.querySelector("#then-now") as HTMLElement;
  160 |     const statsSection = wallSection?.nextElementSibling as HTMLElement;
  161 |     if (!wallSection || !statsSection) return null;
  162 |     return statsSection.getBoundingClientRect().top - wallSection.getBoundingClientRect().bottom;
  163 |   });
  164 |   expect(gap).toBe(0);
  165 |   const combinedPadding = await page.evaluate(() => {
  166 |     const wallSection = document.querySelector("#then-now") as HTMLElement;
  167 |     const statsSection = wallSection?.nextElementSibling as HTMLElement;
  168 |     return (
  169 |       Number.parseFloat(getComputedStyle(wallSection).paddingBottom) +
  170 |       Number.parseFloat(getComputedStyle(statsSection).paddingTop)
  171 |     );
  172 |   });
  173 |   // A normal section-to-section gap runs 64-96px+ on each side (128-192px+
  174 |   // combined); this pair should read as noticeably tighter than that.
> 175 |   expect(combinedPadding).toBeLessThan(100);
      |                           ^ Error: expect(received).toBeLessThan(expected)
  176 | });
  177 | 
  178 | test("'Who pays for this' title and its explainer paragraph are gone from CreditLists", async ({
  179 |   page,
  180 | }) => {
  181 |   await page.goto(PATH);
  182 |   await expect(page.getByText("Who pays for this", { exact: true })).toHaveCount(0);
  183 |   await expect(
  184 |     page.getByText("a college or a sponsor covers the seat", { exact: false }),
  185 |   ).toHaveCount(0);
  186 |   // The rest of CreditLists is still there.
  187 |   await expect(page.getByText("Funders")).toBeVisible();
  188 | });
  189 | 
  190 | test("FormatCards and ImpactTicker section headings match StatementBlock's h2 level, not h3", async ({
  191 |   page,
  192 | }) => {
  193 |   await page.goto(PATH);
  194 |   const formatsHeading = page.getByRole("heading", {
  195 |     level: 2,
  196 |     name: "The only thing that moves you along is what you finished.",
  197 |   });
  198 |   await expect(formatsHeading).toBeVisible();
  199 |   const impactHeading = page.getByRole("heading", {
  200 |     level: 2,
  201 |     name: "Students ship into software other people depend on.",
  202 |   });
  203 |   await expect(impactHeading).toBeVisible();
  204 | });
  205 | 
  206 | test("PortraitWall shows exactly 4 visible images, each with a non-empty alt", async ({ page }) => {
  207 |   await page.goto(PATH);
  208 |   // Each slot pre-mounts every card it may rotate through (hidden via
  209 |   // `display:none`) so swapping never has to mutate an existing card's
  210 |   // content — so this counts only the currently-visible image per slot,
  211 |   // not every image in the DOM.
  212 |   const images = page.locator("#then-now img:visible");
  213 |   await expect(images).toHaveCount(4);
  214 |   const count = await images.count();
  215 |   for (let i = 0; i < count; i += 1) {
  216 |     const alt = await images.nth(i).getAttribute("alt");
  217 |     expect(alt, `image ${i} has an empty alt`).toBeTruthy();
  218 |   }
  219 | });
  220 | 
  221 | test("PortraitWall is a 2x2 grid on mobile", async ({ page }) => {
  222 |   await page.setViewportSize({ width: 375, height: 900 });
  223 |   await page.goto(PATH);
  224 |   const columnCount = await page.evaluate(() => {
  225 |     const img = document.querySelector("#then-now img");
  226 |     let node: HTMLElement | null = img?.parentElement ?? null;
  227 |     while (node && getComputedStyle(node).display !== "grid") node = node.parentElement;
  228 |     return node ? getComputedStyle(node).gridTemplateColumns.split(" ").length : null;
  229 |   });
  230 |   expect(columnCount).toBe(2);
  231 | });
  232 | 
  233 | test("PortraitWall is capped at container.lg (1024px) on very wide viewports", async ({ page }) => {
  234 |   await page.setViewportSize({ width: 1920, height: 900 });
  235 |   await page.goto(PATH);
  236 |   const maxWidth = await page.evaluate(() => {
  237 |     const img = document.querySelector("#then-now img");
  238 |     let node: HTMLElement | null = img?.parentElement ?? null;
  239 |     while (node && getComputedStyle(node).display !== "grid") node = node.parentElement;
  240 |     return node ? getComputedStyle(node).maxWidth : null;
  241 |   });
  242 |   expect(maxWidth).toBe("1024px");
  243 | });
  244 | 
  245 | test("StatTrio is capped at container.lg (1024px) on very wide viewports", async ({ page }) => {
  246 |   await page.setViewportSize({ width: 1920, height: 900 });
  247 |   await page.goto(PATH);
  248 |   const statsLabel = page.getByText("Students have done at least one CodeDay since 2009");
  249 |   const hasContainerLg = await statsLabel.evaluate((el) => {
  250 |     let node: HTMLElement | null = el as HTMLElement;
  251 |     while (node) {
  252 |       if (getComputedStyle(node).maxWidth === "1024px") return true;
  253 |       node = node.parentElement;
  254 |     }
  255 |     return false;
  256 |   });
  257 |   expect(hasContainerLg).toBe(true);
  258 | });
  259 | 
  260 | test("'Why this matters' is capped at container.lg (1024px) on very wide viewports", async ({
  261 |   page,
  262 | }) => {
  263 |   await page.setViewportSize({ width: 1920, height: 900 });
  264 |   await page.goto(PATH);
  265 |   const heading = page.getByRole("heading", {
  266 |     level: 2,
  267 |     name: "Why this matters more than it did five years ago",
  268 |   });
  269 |   // `StatementBlock`'s own heading/body carry their OWN `ch`-based `maxWidth`
  270 |   // (a measure, not a layout cap) closer to the heading than the wrapper
  271 |   // this test cares about — so check every ancestor for the exact 1024px
  272 |   // value rather than assuming the nearest `maxWidth` is the right one.
  273 |   const hasContainerLg = await heading.evaluate((el) => {
  274 |     let node: HTMLElement | null = el as HTMLElement;
  275 |     while (node) {
```