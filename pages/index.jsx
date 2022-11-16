import Head from 'next/head';
import { MongoClient } from 'mongodb';
import { MONGODB_STRING } from '../mongodb';
import MeetupList from '../components/meetups/MeetupList';
import { Fragment } from 'react';
/*
const DUMMY_MEETUPS = [
  {
    id: 'm1',
    title: 'Our first meetup',
    image:
      'https://images.unsplash.com/photo-1514924013411-cbf25faa35bb?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=690&q=80',
    address: 'Toronto 234'
  },
  {
    id: 'm2',
    title: 'Our 2nd meetup',
    image:
      'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1194&q=80',
    address: 'Tokyo 234'
  },
  {
    id: 'm3',
    title: 'Our 3rd meetup',
    image:
      'https://images.unsplash.com/photo-1502899576159-f224dc2349fa?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=764&q=80',
    address: 'New York 39A'
  }
];
*/

const HomePage = (props) => {
  return (
    <>
      <Head>
        <title>Next.js Meetups</title>
        <meta name="description" content="This application is all about Next.js meetups" />
      </Head>
      <MeetupList meetups={props.meetups} />
    </>
  );
};
/*
export async function getServerSideProps(context) {
  const req = context.req;
  const res = context.res;

  return {
    props: {
      meetups: DUMMY_MEETUPS
    }
  };
}
*/

export async function getStaticProps() {
  const client = await MongoClient.connect(MONGODB_STRING);
  const db = client.db();
  const meetupsCollection = db.collection('meetups');
  const meetups = await meetupsCollection.find().toArray();
  client.close();

  return {
    props: {
      meetups: meetups.map((meetup) => ({
        title: meetup.data.title,
        address: meetup.data.address,
        image: meetup.data.image,
        id: meetup._id.toString()
      }))
    },
    revalidate: 10
  };
}

export default HomePage;
