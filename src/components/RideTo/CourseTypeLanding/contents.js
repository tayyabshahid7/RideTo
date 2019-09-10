import React, { Fragment } from 'react'
import CourseTypeDetails from 'components/RideTo/CourseTypeDetails'
import styles from './styles.scss'
import ShowMore from './ShowMore'
import FullLicenceBanner from 'components/RideTo/ResultPage/FullLicenceBanner'

export const SLUG_COURSE_TYPES = {
  'introduction-to-motorcycling': 'INTRO_TO_MOTORCYCLING',
  'cbt-training': 'LICENCE_CBT',
  'cbt-training-renewal': 'LICENCE_CBT_RENEWAL',
  'motorcycle-licence': 'FULL_LICENCE',
  '1-2-1-motorcycle-skills': 'TFL_ONE_ON_ONE'
}

const FULL_LICENCE_FAQS = {
  howMuchTraining:
    "This depends heavily on your riding experience. It's best to call us on 0203 603 9652 to chat with our friendly team about what package is right for you.",
  howFarAdvance:
    'Full licence classes have a very restricted number of places in each course. Due to extremely popular demand, you should aim to book at least 2 weeks in advance in order to get a convenient date.',
  canIJustBook:
    'You can with the government, however there are issues with having the correct bike and learning the required skills. Being professionally taught to ride is vital in becoming a safe rider and successfully gaining your licence.',
  iveCompleted:
    'Yes we can, call our team on 0203 603 9652 to discuss Module 2 availability.',
  whatSize:
    "This very much depends on how old you are. Read our 'What Can I Ride' section."
}

const CBT_FAQS = {
  doesTheBike:
    "Currently no. You can legally train on an automatic and ride a manual 125cc after your CBT, although we'd highly recommend training to ride a manual motorcycle, either through an ITM course or Gear conversion training. ",
  iHaveEU:
    "You'll need to complete a D91 form with the government to get a UK counterpart licence number.",
  howDoIPass:
    "A common misunderstanding - there is no CBT test, it's a training course, which the 5 elements need to be completed in order to gain the certificate. Therefore, if you want a CBT 'licence', book the CBT training.",
  iDontHave:
    "You'll need to apply for a UK provisional licence with the government here.",
  howFarAdvance:
    'CBT classes have a restricted number of places in each course. Due to popular demand, you should aim to book at least 1 week in advance to get a convenient date.'
}

const ITM_FAQ = {
  doINeed:
    'If you’ve never ridden a motorcycle or scooter before and your expectation is to complete your CBT within 1 day, we’d recommend considering the ITM or beginners course first.',
  whatWillIdO:
    'The ITM is tailored to your needs. You’ll focus all the time on bike control and handling, getting to grips with balancing, stopping, starting and turning.',
  howFarAdvance:
    'ITM classes have a restricted number of places in each course. Due to the popular demand, you should aim to book at least 1 week in advance in order to get a convenient date.',
  iCantSee:
    'Not all of our instructors have their introduction courses live online. If you can’t find a local ITM course to you, give us a call and we can arrange something for you.'
}

export const CONTENT = {
  FULL_LICENCE: {
    header: courseType => (
      <Fragment>
        <h1>Full Motorcycle Licence Course</h1>
        <h2>
          A multi day course of training and 2 tests to get a full motorcycle
          licence
          <ul>
            <li>Remove L plates</li>
            <li>Carry passengers</li>
            <li>Ride on motorways</li>
          </ul>
        </h2>
      </Fragment>
    ),
    body: courseType => (
      <Fragment>
        <div>
          <h2>What you'll learn</h2>
          <h3> How to ride the bike for your licence (A1, A2, A)</h3>
          <p>
            You'll learn to ride and pass the tests on the right bike for the
            licence you wish to obtain. either an A1, A2 or A (unrestricted)
            licence depending on your age and the bike you take the tests on.
          </p>
          <h3>Module 1: Maneuvers</h3>
          <p>
            Off road riding; learning the test exercises such as riding in a
            figure of 8, emergency stop and turn in the road.
          </p>
          <h3> Module 2: Theory Questions</h3>
          <p>
            The 'show me tell me' questions an examiner might ask you about bike
            maintenance and safety.
          </p>
          <h3> Module 2: Road Riding Skills</h3>
          <p>
            Riding in a variety of road conditions under directions from the
            examiner as well as following signs, carrying out normal stops,
            pulling away from behind a parked car and a hill start.
          </p>
        </div>
        <FullLicenceBanner
          className={styles.fastTrackAdvert}
          href="https://rideto.typeform.com/to/lyVAhc"
        />
        <div>
          <h2>Requirements</h2>
          <p>
            In order to take the full motorcycle licence course, you must meet
            the following requirements:
          </p>
          <ul>
            <li>
              Have the correct licence card: UK driving, UK provisional or EU
              licence with UK counterpart licence number
            </li>
            <li>Hold a valid CBT certificate</li>
            <li>Hold a valid motorcycle theory certificate</li>
            <li>Be able to read a registration plate from 20.5 meters</li>
            <li> Speak and understand English and the Highway code</li>
            <li>Be able to ride an adult sized bicycle</li>
            <li> Wear suitable clothing including sturdy jeans and boots</li>
          </ul>
        </div>
        <div>
          <h2>What you can ride after</h2>
          <p>
            A Motorcycle licence allows you to ride a motorcycle on the road
            without L-Plates, carry a pillion passenger and ride on motorways.
          </p>
          <p>
            Depending on your age and the bike you train on will decide what you
            can ride after passing.
          </p>
          <ShowMore>
            <p>
              At 16 years old you can get an "AM" licence to ride a motorcycle
              or scooter up 50cc, restricted to 28Mph
            </p>
            <p>
              At 17 - 18 years old you can get an "A1" licence to ride a
              motorcycle or scooter up 125cc
            </p>
            <p>
              At 19 - 23 years old you can get an "A2" licence to ride a
              motorcycle or scooter up 35 Kw of power
            </p>
            <p>
              At 24 years old and above you can get a full unrestricted "A"
              licence to ride a motorcycle or scooter of any power
            </p>
            <p>
              If you take the tests on an automatic geared scooter or
              motorcycle, you'll be restricted to only ride automatic bikes.
              Passing on a manual geared bike allows you to ride both
            </p>
          </ShowMore>
        </div>
        <div style={{ marginTop: '2rem' }}>
          <img
            src="https://bike-tests.s3.eu-west-2.amazonaws.com/static/images/infographic-website%402x.png"
            alt="Info graphic"
          />
        </div>
        <div>
          <h2>Course details</h2>
          <p>
            The full motorcycle licence course combines the training and tests
            for the two motorcycle tests, known as module 1 and module 2.
          </p>
          <p>
            Module 1 is an off-road test to assess your handling and control of
            the bike.
          </p>
          <p>
            Module 2 is an on-road test, similar to the car driving test. You'll
            ride through a variety of road conditions under assessment from an
            examiner following on a motorcycle.
          </p>
          <ShowMore>
            <p>The official list of maneuvers for Module 1 is as follows:</p>
            <ul>
              <li>Wheeling the moped or motorcycle and using the stand</li>
              <li>Riding a slalom and figure of 8</li>
              <li>
                A slow ride - being able to ride and balance a bike at walking
                speed, using clutch and brake control
              </li>
              <li>
                A U-turn - to ride and turn the bike around in the space of a
                normal road
              </li>
              <li>Cornering and a controlled stop</li>
              <li>Cornering and an emergency stop</li>
              <li>Cornering and hazard avoidance</li>
            </ul>
            <p>
              For Module 2 you'll be asked to ride across various local roads
              and within differing traffic conditions and whilst riding you'll
              be asked to carry out a few different maneuvers:
            </p>
            <ul>
              <li>A normal stop</li>
              <li>
                An angled start (pulling out safely from behind a parked
                vehicle)
              </li>
              <li>A hill start (where possible, not everywhere has hills!)</li>
            </ul>
            <p>
              The examiner will give you directions using a one-way radio worn
              on your ear. They'll normally follow you on a motorcycle in much
              the same way as your instructor will do during your training.
            </p>
            <p>
              The final part of module 2 is around 10 minutes of independent
              riding. This is designed to assess your ability to ride safely
              while making your own decisions so you can expect the examiner to
              give you a destination (or a series of turn instructions) and then
              they will follow behind to assess your riding.
            </p>
          </ShowMore>
        </div>
        <div>
          <h2>Frequently Asked Questions</h2>
          <CourseTypeDetails
            courseType={{ details: FULL_LICENCE_FAQS }}
            minimal
          />
        </div>
        <div>
          <h2>Cancellation policy</h2>
          <p>
            Once your booking is confirmed, we can cancel and refund you in full
            as long as you give us at least 12 working days notice before your
            training starts.
          </p>
        </div>
      </Fragment>
    )
  },
  LICENCE_CBT_RENEWAL: {
    header: courseType => (
      <Fragment>
        <h1>CBT Renewal Course</h1>
        <h2>
          A 1 day course designed for experienced riders to complete the CBT
          course for another time
          <ul>
            <li>Ride up to 125cc (11Kw) scooter or motorcycle</li>
            <li>Ride on dual carriageways</li>
            <li>You cannot ride on motorways or take passengers</li>
            <li>You must display L plates</li>
            <li>Valid for another 2 years</li>
          </ul>
        </h2>
      </Fragment>
    ),
    body: courseType => (
      <Fragment>
        <div>
          <h2>What you'll learn</h2>
          <h3>Refresh on the basics of motorcycle controls and handling</h3>
          <p>
            You'll learn how a motorcycle works; the controls, maintenance and
            safety checks you should conduct before riding and how to move and
            park your bike.
          </p>
          <h3>
            A review of how to safely ride and control a scooter or motorcycle
          </h3>
          <p>
            The instructor will refresh your skills on maneuvers, braking,
            observations, clutch control and gear changing (on a manual
            motorcycle).
          </p>
          <h3>Road riding theory</h3>
          <p>
            You'll be shown diagrams and discuss the correct theory of how to
            ride safely on the road and asked questions about what to do.
          </p>
          <h3>Practical road riding</h3>
          <p>
            You'll spend at least 2 hours riding on a variety of roads with your
            instructor, who will give directions through a radio earpiece and
            teach you how to change any 'bad habits'.
          </p>
        </div>
        <div>
          <h2>Requirements</h2>
          <p>
            In order to take the CBT Renewal training course, you must meet the
            following requirements:
          </p>
          <ul>
            <li>
              Have the correct licence card: UK driving, UK provisional or EU
              licence with UK counterpart licence number. Photocopies or images
              are not accepted.
            </li>
            <li>Be able to read a registration plate from 20.5 meters</li>
            <li>Speak and understand English and the Highway code</li>
            <li>Be able to ride an adult sized bicycle</li>
            <li>
              Wear suitable clothing including thick trousers (such as jeans)
              and leather boots
            </li>
            <li>Have a valid CBT certificate </li>
            <li>
              Have your National Insurance number in case of a licence check
            </li>
          </ul>
        </div>
        <div>
          <h2>What you can ride after</h2>
          <p>
            A new CBT licence allows you to ride up to a 125cc motorcycle or
            scooter on the road for another 2 years. You must still display
            L-Plates and cannot carry a pillion passenger or ride on motorways.
          </p>
          <ShowMore>
            <p>
              At 16 years old you are restricted to riding a motorcycle or
              scooter up 50cc, restricted to 28Mph. When you turn 17, you may
              then ride up to 125cc with a limit of 11Kw of power
            </p>
            <p>
              At 17 years and above you can ride up to 125cc with a limit of
              11Kw of power.
            </p>
            <p>
              If you take the CBT on an automatic scooter, you are technically
              still entitled to ride a manual geared motorcycle on the road,
              however we would strongly recommend taking a Gear Conversion
              course before riding a manual bike if you have not had
              professional training.
            </p>
          </ShowMore>
        </div>
        <div>
          <h2>Course details</h2>
          <p>
            CBT renewals aren't technically a different course to the CBT but
            are often referred to as a 'renewal'. The CBT renewal course is the
            full CBT training course, usually taken at a slightly quicker pace
            if riders can show they are confident with each element of the CBT.
            All 5 elements must still be completed
          </p>
          <p>
            If the instructor feels you need more training to complete any
            elements of the course, they will ask you to come back for further
            training. The 5 elements of the CBT are:
          </p>
          <ShowMore>
            <h3>Introduction and Eyesight Check </h3>
            <p>
              Welcome and brief to what to expect during the course, as well as
              an eyesight test to check you can read a registration plate at a
              distance of 20.5 meters. You may wear glasses if you use them.
            </p>
            <h3>On-Site Training </h3>
            <p>
              A basic demonstration of how a motorcycle works; the controls,
              maintenance and safety checks and how to move and park your bike.
              You will be shown how everything on a bike works then given the
              chance to try it yourself to make sure you're comfortable.
            </p>
            <h3>On-Site Riding </h3>
            <p>
              The instructor will teach you maneuvers, braking, observations,
              clutch control and gear changing (on a manual motorcycle). You'll
              spend a lot of time riding around cones, practicing different road
              riding scenarios and techniques.
            </p>
            <h3>On-Road Training </h3>
            <p>
              Road riding theory, covering the highway code and best practice
              for riding safely on the road. You'll be shown diagrams of how to
              ride safely on the road in different scenarios and asked questions
              about what to do.
            </p>
            <h3>On-Road Riding</h3>
            <p>
              This is a 2 hour minimum road ride which will take place on
              various roads around the training site. You will be in a group no
              larger than 2 students with your instructor, who will give
              directions through a radio earpiece.
            </p>
          </ShowMore>
        </div>
        <div>
          <h2>Frequently Asked Questions</h2>
          <CourseTypeDetails courseType={{ details: CBT_FAQS }} minimal />
        </div>
        <div>
          <h2>Cancellation policy</h2>
          <p>
            You won't be charged anything until your booking is confirmed. Once
            the booking is confirmed, we can cancel or refund you in full as
            long as you give us at least 3 working days notice before your
            training.
          </p>
        </div>
      </Fragment>
    )
  },
  LICENCE_CBT: {
    header: courseType => (
      <Fragment>
        <h1>CBT Course</h1>
        <h2>
          A 1 day course designed to prepare new riders to ride up to a 125cc
          motorcycle or scooter
          <ul>
            <li>Ride up to 125cc (11Kw) scooter or motorcycle</li>
            <li>Ride on dual carriageways</li>
            <li>You cannot ride on motorways or take passengers</li>
            <li>You must display L plates</li>
            <li>Valid for 2 years</li>
          </ul>
        </h2>
      </Fragment>
    ),
    body: courseType => (
      <Fragment>
        <div>
          <h2>What you'll learn</h2>
          <h3>The basics of motorcycle controls and handling</h3>
          <p>
            You'll learn how a motorcycle works; the controls, maintenance and
            safety checks you should conduct before riding and how to move and
            park your bike.
          </p>
          <h3>
            How to safely ride and control a scooter or motorcycle off road
          </h3>
          <p>
            The instructor will teach you maneuvers, braking, observations,
            clutch control and gear changing (on a manual motorcycle). You'll
            spend a lot of time riding around cones, practicing different road
            riding scenarios and techniques.
          </p>
          <h3>Road riding theory</h3>
          <p>
            You'll be shown diagrams and discuss the correct theory of how to
            ride safely on the road and asked questions about what to do.
          </p>
          <h3>Practical road riding</h3>
          <p>
            You'll spend at least 2 hours riding on a variety of roads with your
            instructor, who will give directions through a radio earpiece.
          </p>
        </div>
        <div>
          <h2>Requirements</h2>
          <p>
            In order to take the CBT training course, you must meet the
            following requirements:
          </p>
          <ul>
            <li>
              Have the correct licence card: UK driving, UK provisional or EU
              licence with UK counterpart licence number. Photocopies or images
              are not accepted.
            </li>
            <li>Be able to read a registration plate from 20.5 meters</li>
            <li>Speak and understand English and the Highway code</li>
            <li>Be able to ride an adult sized bicycle</li>
            <li>
              Wear suitable clothing including thick trousers (such as jeans)
              and leather boots
            </li>
            <li>
              Have your National Insurance number in case of a licence check
            </li>
          </ul>
        </div>
        <div>
          <h2>What you can ride after</h2>
          <p>
            A CBT licence allows you to ride up to a 125cc motorcycle or scooter
            on the road for 2 years. You must display L-Plates and cannot carry
            a pillion passenger or ride on motorways.
          </p>
          <ShowMore>
            <p>
              At 16 years old you are restricted to riding a motorcycle or
              scooter up 50cc, restricted to 28Mph. When you turn 17, you may
              then ride up to 125cc with a limit of 11Kw of power
            </p>
            <p>
              At 17 years and above you can ride up to 125cc with a limit of
              11Kw of power.
            </p>
            <p>
              If you take the CBT on an automatic scooter, you are technically
              still entitled to ride a manual geared motorcycle on the road,
              however we would strongly recommend taking a Gear Conversion
              course before riding a manual bike if you have not had
              professional training.
            </p>
          </ShowMore>
        </div>
        <div>
          <h2>Course details</h2>
          <p>
            The CBT course is often confused as a test however it is not a test
            but a course typically completed in one day, usually taking around 6
            - 8 hours. There are 5 elements which must all be completed
            consecutively in order to gain the paper CBT certificate at the end
            of the course.
          </p>
          <p>
            If the instructor feels you need more training to complete any
            elements of the course, they will ask you to come back for further
            training. The 5 elements of the CBT are:
          </p>
          <ShowMore>
            <h3>Introduction and Eyesight Check </h3>
            <p>
              Welcome and brief to what to expect during the course, as well as
              an eyesight test to check you can read a registration plate at a
              distance of 20.5 meters. You may wear glasses if you use them.
            </p>
            <h3>On-Site Training </h3>
            <p>
              A basic demonstration of how a motorcycle works; the controls,
              maintenance and safety checks and how to move and park your bike.
              You will be shown how everything on a bike works then given the
              chance to try it yourself to make sure you're comfortable.
            </p>
            <h3>On-Site Riding </h3>
            <p>
              The instructor will teach you maneuvers, braking, observations,
              clutch control and gear changing (on a manual motorcycle). You'll
              spend a lot of time riding around cones, practicing different road
              riding scenarios and techniques.
            </p>
            <h3>On-Road Training </h3>
            <p>
              Road riding theory, covering the highway code and best practice
              for riding safely on the road. You'll be shown diagrams of how to
              ride safely on the road in different scenarios and asked questions
              about what to do.
            </p>
            <h3>On-Road Riding</h3>
            <p>
              This is a 2 hour minimum road ride which will take place on
              various roads around the training site. You will be in a group no
              larger than 2 students with your instructor, who will give
              directions through a radio earpiece.
            </p>
          </ShowMore>
        </div>
        <div>
          <h2>Frequently Asked Questions</h2>
          <CourseTypeDetails courseType={{ details: CBT_FAQS }} minimal />
        </div>
        <div>
          <h2>Cancellation policy</h2>
          <p>
            You won't be charged anything until your booking is confirmed. Once
            the booking is confirmed, we can cancel or refund you in full as
            long as you give us at least 3 working days notice before your
            training.
          </p>
        </div>
      </Fragment>
    )
  },
  TFL_ONE_ON_ONE: {
    header: courseType => (
      <Fragment>
        <h1>Free 1-2-1 Motorcycle Skills Course</h1>
        <h2>
          A 2 hour 1-2-1 session available to anyone who lives, works or studies
          in London
          <ul>
            <li>Ride a route of your choice with an instructor</li>
            <li>Develop further riding skills to stay safe riding in London</li>
            <li>You cannot ride on motorways or take passengers</li>
            <li>
              You'll need to have your own road legal bike and a valid CBT
            </li>
            certificate
          </ul>
        </h2>
      </Fragment>
    ),
    body: courseType => (
      <Fragment>
        <div>
          <h2>What you'll learn</h2>
          <h3>Improved city riding skills</h3>
          <p>
            Learn to ride safely on urban roads, including how to filter,
            overtake and ride in bus lanes on a route of your choosing
          </p>
          <h3>Hazard perception</h3>
          <p>
            Improve hazard perception and defensive riding skills as a
            motorcyclist in the city
          </p>
          <h3>Road riding theory</h3>
          <p>
            You'll be shown diagrams and discuss the correct theory of how to
            ride safely on the road and asked questions about what to do
          </p>
          <h3>Speed control and awareness</h3>
          <p>
            Better understand the need to ride at speeds appropriate to the road
            conditions
          </p>
        </div>
        <div>
          <h2>Requirements</h2>
          <p>
            In order to take the free 1-2-1 motorcycle skills course you must
            meet the following requirements:
          </p>
          <ul>
            <li>Live, work or study in any of the 33 London Boroughs</li>
            <li>
              Have a valid CBT certificate and road legal scooter or motorcycle
              to train on
            </li>
            <li>
              Wear suitable clothing including thick trousers (such as jeans)
              and leather boots
            </li>
          </ul>
        </div>
        <div>
          <h2>What you can ride after</h2>
          <p>
            At the end of the session, the instructor will provide both verbal
            and written feedback on your riding and how you can continue to
            improve. A certificate of completion will be issued on Behalf of
            Transport for London by the Instructor. The course is not a licence
            and does not change your entitlement to what you can ride on the
            road.
          </p>
        </div>
        <div>
          <h2>Course details</h2>
          <p>
            The instructor comes to you such as your home or workplace. 1-2-1
            Motorcycle Skills training sessions are Client-led, they are based
            on what you want to learn, and the routes you want to ride. You will
            be encouraged to select the route you use most often, or which you
            find most challenging.
          </p>
          <ShowMore>
            <p>
              The assessment ride will consist in the instructor following you
              and analysing your riding skills on a public road, including the
              following core areas:
            </p>
            <ul>
              <li>Normal road positioning</li>
              <li>Separation distance</li>
              <li>Appropriate use of speed</li>
              <li>Use of observations</li>
              <li>Use of mirrors</li>
              <li>Road attitude</li>
              <li>Junction approach procedures</li>
              <li>Roundabout procedures (mini, standard, multi-lane, etc.)</li>
              <li>Reaction to other road users</li>
              <li>Progress / hesitancy</li>
              <li>Corners / bends</li>
              <li>Motorways / dual carriageways (if available/allowed)</li>
            </ul>
            <p>
              The instructor will provide feedback to the rider as it progresses
              via radio/stops, using video and other training aids where
              relevant.
            </p>
          </ShowMore>
        </div>
        <div>
          <h2>Cancellation policy</h2>
          <p>
            Once your booking is confirmed, we can cancel the course as long as
            you give us at least 3 working days notice before your training.
          </p>
        </div>
      </Fragment>
    )
  },
  INTRO_TO_MOTORCYCLING: {
    header: courseType => (
      <Fragment>
        <h1>Introduction to motorcycling Course</h1>
        <h2>
          A 2 hour introduction course, to give new riders experience before the
          CBT
          <ul>
            <li>
              Focus on the core skills and controls of riding a motorcycle
            </li>
            <li>
              Experience the fun and freedom before committing to the CBT course
            </li>
            <li>Learn the basics of clutch and gear controls</li>
            <li>Not a valid licence to ride on the road</li>
          </ul>
        </h2>
      </Fragment>
    ),
    body: courseType => (
      <Fragment>
        <div>
          <h2>What you'll learn</h2>
          <h3>Introduction to basics of motorcycle controls and handling</h3>
          <p>
            You'll learn how a motorcycle works; the controls, maintenance and
            safety checks you should conduct before riding including how to move
            and park your bike.
          </p>
          <h3>How to safely ride and control a scooter or motorcycle</h3>
          <p>
            The instructor will start from scratch and teach you the core skills
            of how to stop, start, turn and brake. You'll also learn the basic
            observations you should make and spend time learning clutch control
            and gear changing (on a manual motorcycle).
          </p>
        </div>
        <div>
          <h2>Requirements</h2>
          <p>
            In order to take the Introduction to motorcycling course, you must
            meet the following requirements:
          </p>
          <ul>
            <li>
              Have the correct licence card: UK driving, UK provisional or EU
              licence with UK counterpart licence number. Photocopies or images
              are not accepted.
            </li>
            <li>Be able to read a registration plate from 20.5 meters</li>
            <li>Speak and understand English and the Highway code</li>
            <li>Be able to ride an adult sized bicycle</li>
            <li>
              Wear suitable clothing including thick trousers (such as jeans)
              and leather boots
            </li>
          </ul>
        </div>
        <div>
          <h2>What you can ride after</h2>
          <p>
            The introduction to motorcycling course is not a valid licence, so
            you are not legally entitled to ride a motorcycle on the road after
            the course. The next step is to complete the CBT course to be able
            to ride on the road.
          </p>
        </div>
        <div>
          <h2>Course details</h2>
          <p>
            The introduction motorcycle lesson follows the same format as the
            beginning of the CBT. Introducing you to the most basic skills and
            techniques you will need to ride a motorcycle and progress on to the
            CBT.
          </p>
          <p>
            This includes the controls of the motorcycle, how to sit and balance
            yourself on a motorcycle, how to put the motorcycle on its stand and
            take it off again too, clutch control and gear selection and how to
            ride and turn the motorcycle.
          </p>
          <p>
            It's a relaxed and introductory session designed to give you a
            taster of what riding on two wheels is like.
          </p>
          <p>
            The course is ideal for anyone looking to practice riding ahead of
            taking the CBT, especially for new riders planning to ride a geared
            motorcycle with no previous experience.
          </p>
        </div>
        <div>
          <h2>Frequently Asked Questions</h2>
          <CourseTypeDetails courseType={{ details: ITM_FAQ }} minimal />
        </div>
        <div>
          <h2>Cancellation policy</h2>
          <p>
            You won't be charged anything until your booking is confirmed. Once
            the booking is confirmed, we can cancel or refund you in full as
            long as you give us at least 3 working days notice before your
            training.
          </p>
        </div>
      </Fragment>
    )
  }
}

export const LOCATIONS = {
  FULL_LICENCE: [
    'london',
    'birmingham',
    'swansea',
    // 'bristol',
    'essex',
    'exeter',
    'portsmouth',
    'cardiff',
    'chelmsford',
    'brighton'
  ],
  LICENCE_CBT_RENEWAL: [
    'london',
    'bristol',
    'birmingham',
    'manchester',
    'glasgow',
    'southampton',
    'bournemouth',
    'portsmouth',
    'brighton',
    'cardiff'
  ],
  LICENCE_CBT: [
    'london',
    'bristol',
    'birmingham',
    'manchester',
    'glasgow',
    'southampton',
    'bournemouth',
    'portsmouth',
    'brighton',
    'cardiff'
  ],
  TFL_ONE_ON_ONE: ['london'],
  INTRO_TO_MOTORCYCLING: [
    'london',
    'bristol',
    'birmingham',
    'manchester',
    'glasgow',
    'southampton',
    'bournemouth',
    'portsmouth'
  ]
}

export function getLocations({ constant }) {
  return LOCATIONS[constant]
}

export function landingPageUrl(location, { constant }) {
  const a = SLUG_COURSE_TYPES
  return `/${Object.keys(a).find(key => a[key] === constant)}/${location}`
}
