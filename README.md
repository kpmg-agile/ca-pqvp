# Public prototype URL
https://www.calproc.website/

# Technical approach narrative
This narrative describes how we approached the prototype development and provides links to appropriate wiki articles. We have also included additional supporting documentation to help describe what we developed.

Please refer to the following links:

1. [CalProc from start to finish]() - an in-depth look into what we did & how we did it 
2. [Compliance guide]() - how we complied with the US Digital Services Playbook
3. [CalProc User guide]() – a guide to the features and functionality

## Bring the right people to the team. 
The first question we ask when faced with a client issue, request or challenge is “what people do we need to help us understand and surround this?” At KPMG, we are able to draw on a deep bench and a global network of skilled professionals to help us tackle even the most complex of challenges.

After analyzing the prototype requirements, we identified the [roles](https://github.com/kpmg-agile/ca-pqvp/wiki/Roles-&-Responsibilities) and the best people to lead and develop the prototype. We assigned and empowered a product manager, a Scrum Master, architects, designers and developers. We mapped the product manager role to our Scrum “Product Owner” role. We also identified staff to act as “users” and “stakeholders” of the solution, to provide us with feedback throughout the project. 

## Create a product vision. Kick off!

![Logo](https://cloud.githubusercontent.com/assets/25646919/22888772/e0fa7550-f1d4-11e6-9952-ddd1cd54bfe1.png)

The product manager created a [product vision](https://github.com/kpmg-agile/ca-pqvp/wiki/Product-Vision) – developed in collaboration with the users - and discussed this with the team at a kick-off meeting.

The team introduced themselves, their roles and skill sets. The product manager held a Q&A session and an open discussion. We were all in agreement as to what the overall goal was for the product.

## Create an initial backlog. Base it on what users want.

Next, the product manager created an initial product backlog, in collaboration with stakeholders and the development team. This backlog consisted of a number of different types of work required – from user stories to DevOps tasks. It also represented the full list of features desired for the prototype.

We used GitHub to create and categorize the backlog as “issues”. In our experience, having everything in one place - such as code, backlogs, user stories, estimation and bug tracking – makes things simpler. It improves transparency and traceability and allows the team to focus on what’s important – building a great user experience. 

## Don’t re-invent the wheel. Accelerate then Estimate.

We believe in tried-and-tested software and methodology. We searched our library of existing assets and selected an accelerator called “webstart” that met a large number of technical requirements for the prototype. This accelerator would provide the “scaffolding” for the project, and meant we didn’t have to start from scratch.

Many of the development team have used webstart before. Using this framework, and their past experience, the team was able to produce estimates of the work. The team assigned points to each item in the backlog that allowed everyone to see how complex a piece of work was relative to others.

An initial [development guide](https://github.com/kpmg-agile/ca-pqvp/blob/master/DEVGUIDE.md) was created based on the webstart accelerator, and published on the GitHub wiki to help the development team get started.

## Plan the release and first sprint.

Armed with the product backlog, development estimates, stakeholder priorities and the required timeline, the entire team met to plan the production of the prototype. We assigned goals for each sprint, and populated the first sprint with work items from the backlog.

Given the short timeline, the team decided there would be one release that would cover the entire project. This release would consist of three sprints, each lasting one week – starting on Mondays - and each one with a specific goal. The table below summarizes the release plan and sprint goals.

### Release
| | Initiation | Sprint 1 | Sprint 2 | Sprint 3
| ------------ | ------------- | ------------- | ------------- | -------------
| Sprint Goal | Onboard the team and analyze the prototype requirements. Identify and consult with users to create an initial backlog. <br><br> Select an accelerator and determine the additional tech stack and architecture. | Deliver a shippable log in page for the auth user and admin user, complete designs and all mandatory DevOps/FrontEnd/BackEnd work. <br><br>This investment now will rapidly increase our velocity of user stories delivered for Sprint 2 & 3. | Incorporate user feedback and fix outstanding issues from Sprint 1.<br><br> Create a core shippable product from the bulk of the priority user stories. Refine DevOps processes as required. | Incorporate user feedback and fix outstanding issues from Sprint 2.<br><br> Develop remaining core stories and add as many additional value-adds and features as possible.

After each sprint planning meeting (held on the Monday of each sprint), a sprint backlog was created and managed within GitHub.
 

## Define done.

Before starting work on the first sprint, the team worked together to create an initial [definition of done](https://github.com/kpmg-agile/ca-pqvp/wiki/Definition-Of-Done-(DOD)). With this definition, the development team knew when to mark a backlog item as completed. 

## Development excellence by self-organizing teams.

The developers were empowered to pull work from the sprint backlog, assign issues to each other and work together to determine the best approach to complete the work.

Communication was key to making this approach successful. The entire team used Slack to stay in near constant contact throughout the day. With the product manager and Scrum Master on these Slack channels as well as the developers, the team was able to resolve impediments rapidly.

Also key to communication was the daily scrum. The daily scrum was a 15 minute meeting where developers shared what they worked on yesterday, what their plan is for the day and any of their impediments. In this way, everyone was informed about each other’s work and each of us had a clear picture of what needed to be done. The Scrum Master helped keep these meetings flowing, and made sure they finished on time.
 
## Invest in user-centric design before jumping in.

We committed to a small number of shippable end-user stories in the first sprint. We prioritized getting designs for the core product done. We did this to minimize the possibility of re-work in a later iteration.

At KPMG, we believe in getting as much user feedback as possible before coding to minimize waste.  We have the capability to show users the prototype screens and behavior before we invest in coding it.

Our development team included a highly experienced and skilled User Experience (UX) designer who performed and coordinated the following techniques:

**1. Identify the right “users”.** To get realistic feedback, we found realistic users. These included former state employees, managers, junior staff and staff with procurement software experience.

**2. Interviews.** Users were asked targeted questions to understand their needs and expectations for the product. A selection of interview transcripts are available on the project wiki.

**3. Research existing products.** We evaluated existing procurement products such as Amazon and SAP Ariba. We assessed their features, what they did well, what they could improve and incorporated these into our design. 

**4. Interactive wireframes and storyboards.** We built wireframes using Adobe Photoshop and created interactive storyboards in KPMG’s Cycle product. These allowed us to show users the screens and navigational journeys before we started coding. We collected feedback and used it to improve the designs.

## Invest in DevOps and Technical Architecture early.

Similar to our design approach, we believe that if there is an opportunity to do things “properly”, we should take it. Cutting corners and hardcoding will lead to a large amount of technical debt, little or no improvements, and low Sprint development velocity. This could ultimately be a project’s undoing further down the line.

Investing in DevOps infrastructure and carefully designing the technical architecture and backend services during Sprint 1 enabled us to run short (weekly) sprints with shippable products at the end. We were able to increase our development velocity significantly during Sprints 2 and 3 thanks to this architecture. We also minimized re-work.

We have listed the most significant of these investments, and their benefits below:

**1. GitHub integration with Jenkins and Slack.** Providing continuous integration and constant communication.

**2. Secure. Machine access is secured through a VPN.** Internet facing traffic on these machines is routed through WAF. Regions are segmented and secure from each other (unless specified).

**3. Containerization.** Packages software so it’s runnable on anything that is running Docker. We can ship the container and not the code.

**4. Technical architecture.** Load balanced with backend REST services. Nothing is hard coded in our prototype. We believe in producing quality products through agile. We do not consider poorly written or “hard-coded” code to be shippable.

## Review, improve, iterate.

After each sprint was over, the team conducted a Sprint Review. The users were our stakeholders, and were invited to these meetings. The development team presented a demo of their progress, and the product owner and users were invited to provide feedback. We noted this feedback and incorporated it into the next sprint. This helped us keep our product highly user-focused.

Before planning and starting the next sprint, the team also conducted a Sprint Retrospective. In this meeting, we discussed what worked well, what went wrong and what needs improving. We believe that continuous improvement is key to agile software development. We judge the success of our teams not just on the quality of their products, but by how much they are improving.



#Problem Statement - Prototype A

The working prototype will be an application that will allow authorized users to compare and order end-user computing hardware (e.g., desktops, laptops, monitors), software (e.g., office productivity tools), and related services from pre-established state contracts, and allow authorized users to cancel, track and analyze their orders. 

In addition, the working prototype will provide the authorized administrative users who are employees of state’s lead purchasing organizations – the Department of General Services and the Department of Technology – with the ability to publish product and service information and track, analyze and visualize order data. 

The working prototype does not need to implement any authentication or authorization against an external directory or authentication mechanism.

##Compliance with Requirements


### a. Assigned one (1) leader and gave that person authority and responsibility and held that person accountable for the quality of the prototype submitted;
> Product Owner Ben Rogers is the (1) leader.

### b.Assembled a multidisciplinary and collaborative team that includes, at a minimum, five (5) of the labor categories as identified in Attachment B: PQVP DS-AD Labor Category Descriptions;
> 
1. Product Manager – Ben Rogers
2. Technical Architect – Robert Levy
3. Interaction Designer/User Researcher/Usability Tester – Ryan Lee
4. Writer/Content Designer/Content Strategist – Cory Fritzsching, David Wolf
5. Visual Designer – Ryan Lee
6. Front End Web Developer – Casey Rayl, Nick Pierce, Robert Levy
7. Backend Web Developer – Sandeep Pedditi, Bhavesh Jain
8. DevOps Engineer – Chris Robinson, Sikender Mohammed
9. Security Engineer
10. Delivery Manager
11. Agile Coach – Matt Kwong
12. Business Analyst – Stacy Lee, Simon Chen
13. Digital Performance Analyst

### c. Understood what people needed, by including people in the prototype development and design process;
> Identified [6 Users](https://github.com/kpmg-agile/ca-pqvp/wiki/User-Interview-participants:) to serve as interviewees, design reviewers, and usability testers. Their feedback at each iteration informed the goals of the next.  As design wireframes and full fidelity comps evolved, our users leveraged KPMG's proprietary [Cycle tool](https://www.youtube.com/watch?v=ExHlOl7m0U0) to provide ongoing feedback.  Cycle allows users to interact with design concept as "clickable prototypes" and provide comments to the design team in the form of annotations.

### d. Used at least a minimum of three (3) “user-centric design” techniques and/or tools;
> We used multiple “user-centric design” tools including User Interviews ([#1](https://github.com/kpmg-agile/ca-pqvp/wiki/User-Interview-%231-(Auth))/[#2](https://github.com/kpmg-agile/ca-pqvp/wiki/User-interview-%232-(Admin))/[#3](https://github.com/kpmg-agile/ca-pqvp/wiki/User-interview-%233-(Auth))/[#4](https://github.com/kpmg-agile/ca-pqvp/wiki/User-Interview-%234-(Admin))), [User Stories](https://github.com/kpmg-agile/ca-pqvp/labels/story), [User Personas](https://github.com/kpmg-agile/ca-pqvp/wiki/Persona-Structure-(Draft-In-Process)), Workflow Diagrams, KPMG Cycle, and [Usability Testing](https://github.com/kpmg-agile/ca-pqvp/wiki/Usability-Testing-Notes).

### e. Used GitHub to document code commits;
> Our [GitHub Repository](https://github.com/kpmg-agile/ca-pqvp).

### f. Used Swagger to document the RESTful API, and provided a link to the Swagger API;<br>
> Authored API specs in RAML and converted to Swagger via a raml2swagger script ([Issue 71](https://github.com/kpmg-agile/ca-pqvp/pull/71), [RAML spec](https://github.com/kpmg-agile/ca-pqvp/tree/master/raml), [RAML docs](https://jenkins.calproc.website/job/SIT/job/4_Gather_Reports/lastSuccessfulBuild/artifact/docs/raml/index.html), [Swagger Spec](https://github.com/kpmg-agile/ca-pqvp/tree/master/swagger), [SwaggerHub](https://app.swaggerhub.com/api/robertlevy/KPMG-Agile-CALPROC/1)).  In addition to authoring specs for RESTful APIs, our standard software approach heavily leverages tools that parse these specs.  This includes automatic code generation of mock services (so UI development can proceed before backend systems are ready), a NodeJS intercepter that validates requests/responses against schemas (to identify defects quickly), and client-side wrappers around the API (to expedite development).

### g. Complied with Section 508 of the Americans with Disabilities Act and WCAG 2.0;<br>
>  Incorporated standards from http://usability.gov and http://standards.usa.gov into our design, including Section 508 and WCAG 2.0 compliance. See [Design Links](https://github.com/kpmg-agile/ca-pqvp/wiki/Design-Links) for more details on these standards.  By leveraging accessibility-optimized npm packages including USWDS and Bootstrap, issues were minimized.  Testing was performed with two tools, [Chrome Accessibility extension](https://chrome.google.com/webstore/detail/accessibility-developer-t/fpkknkljclfencbdbgkenhalefipecmb?hl=en) and (HTML_CodeSniffer)[http://squizlabs.github.io/HTML_CodeSniffer/].  All errors (and appropriate warnings) identified by these tools were promptly addressed.

### h. Created or used a design style guide and/or a pattern library;<br>
> Used a design style guide based on U.S. Web Design Standard, 18F Content Guide, and Usability.gov.  See [Design Links](https://github.com/kpmg-agile/ca-pqvp/wiki/Design-Links) for more details on these standards.  The USWDS npm package is heavily utilized in our implementation.

### i. Performed usability tests with people;
> Find more details in our [Design Plan](https://github.com/kpmg-agile/ca-pqvp/wiki/Design-Plan) and our [Usability Test Notes](https://github.com/kpmg-agile/ca-pqvp/wiki/Usability-Testing-Notes).

### j. Used an iterative approach, where feedback informed subsequent work or versions of the prototype;
> We started with initial wireframes and workflows, moved to a clickable high fidelity design, then to usability testing to source feedback for the next iteration in design/prototype. Find more details in our [Design Plan](https://github.com/kpmg-agile/ca-pqvp/wiki/Design-Plan).

### k. Created a prototype that works on multiple devices, and presents a responsive design;
> Our prototype employs a responsive design that gives a consistent experience between desktop, laptop, tablet, and smartphone devices.

### l. Used at least five (5) modern2 and open-source technologies, regardless of architectural layer (frontend, backend, etc.);
> Some are listed here, but consult the [Development Guide](https://github.com/kpmg-agile/ca-pqvp/blob/master/DEVGUIDE.md) for details on all the technologies used.
* Jenkins 2.6.1 – 10/13/2016
* Nagios 4.2.4 – 12/7/2016
* Angular 2.4 – 12/20/2016
* NodeJS 7.5 – 1/31/2017
* Neo4j 3.0 - 4/26/2016
* Docker 1.13.1 – 2/8/2017

### m. Deployed the prototype on an Infrastructure as a Service (IaaS) or Platform as Service (PaaS) provider, and indicated which provider they used;
> Prototype is deployed on Microsoft Azure in an IaaS configuration.

### n. Developed automated unit tests for their code;
> Developed unit tests using Jasmine, Karma, Protractor, and ESLint.  Reports are made available (from Jenkins)[https://jenkins.calproc.website/job/SIT/job/4_Gather_Reports/lastSuccessfulBuild/artifact/reports/index.html].

### o. Setup or used a continuous integration system to automate the running of tests and continuously deployed their code to their IaaS or PaaS provider;
> We’ve setup a continuous integration system using Jenkins and Github to automatically run tests and deploy code to Azure ([Issue #70](https://github.com/kpmg-agile/ca-pqvp/issues/70))

### p. Setup or used configuration management;
> Github was used to track and control changes to the source code (Our [GitHub Repository](https://github.com/kpmg-agile/ca-pqvp)).

### q. Setup or used continuous monitoring;
> We are using Nagios, GoAccess, and Azure built-in tools for continuous monitoring.

### r. Deployed their software in an open source container, such as Docker (i.e., utilized operating-system-level virtualization);
> We are using Docker for operating system-level virtualization.

### s. Provided sufficient documentation to install and run their prototype on another machine; and
> We have provided this documentation in our [Development Guide](https://github.com/kpmg-agile/ca-pqvp/blob/master/DEVGUIDE.md).

### t. Prototype and underlying platforms used to create and run the prototype are openly licensed and free of charge.
> Yes, consult the [Development Guide](https://github.com/kpmg-agile/ca-pqvp/blob/master/DEVGUIDE.md) for more details.

##US Digital Services Playbook

Per "Attachment 1: PQVP DS-AD Working Prototype and Technical Approach Requirements (2) Technical Approach" we have followed the  US Digital Services Playbook, where applicable, to our approach to building the prototype.

Click the links below to see the different Plays from the US Digital Services Playbook, and how we used them.

* [Play 1 Understand what people need](https://github.com/kpmg-agile/ca-pqvp/wiki/US-Digital-Services-Playbook-Play-1)
* [Play 2 Address the whole experience, from start to finish](https://github.com/kpmg-agile/ca-pqvp/wiki/US-Digital-Services-Playbook-Play-2)
* [Play 3 Make it simple and intuitive](https://github.com/kpmg-agile/ca-pqvp/wiki/US-Digital-Services-Playbook-Play-3)
* [Play 4 Build the service using agile and iterative practices](https://github.com/kpmg-agile/ca-pqvp/wiki/US-Digital-Services-Playbook-Play-4)
* [Play 5 Structure budgets and contracts to support delivery](https://github.com/kpmg-agile/ca-pqvp/wiki/US-Digital-Services-Playbook-Play-5)
* [Play 6 Assign one leader and hold that person accountable](https://github.com/kpmg-agile/ca-pqvp/wiki/US-Digital-Services-Playbook-Play-6)
* [Play 7 Bring in experienced teams](https://github.com/kpmg-agile/ca-pqvp/wiki/US-Digital-Services-Playbook-Play-7)
* [Play 8 Choose a modern technology stack](https://github.com/kpmg-agile/ca-pqvp/wiki/US-Digital-Services-Playbook-Play-8)
* [Play 9 Deploy in  flexible hosting environment](https://github.com/kpmg-agile/ca-pqvp/wiki/US-Digital-Services-Playbook-Play-9)
* [Play 10 Automate testing and deployments](https://github.com/kpmg-agile/ca-pqvp/wiki/US-Digital-Services-Playbook-Play-10)
* [Play 11 Manage security and privacy through reusable processes](https://github.com/kpmg-agile/ca-pqvp/wiki/US-Digital-Services-Playbook-Play-11)
* [Play 12 Use data to drive decisions](https://github.com/kpmg-agile/ca-pqvp/wiki/US-Digital-Services-Playbook-Play-12)
* [Play 13 Default to open](https://github.com/kpmg-agile/ca-pqvp/wiki/US-Digital-Services-Playbook-Play-13)





