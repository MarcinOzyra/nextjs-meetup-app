import { MongoClient, ObjectId } from 'mongodb';
import { MONGODB_STRING } from '../../mongodb';
import MeetupDetail from '../../components/meetups/MeetupDetail';
import Head from 'next/head';

const MeetupDetails = (props) => {
  // console.log(props.meetupData);
  return (
    <>
      <Head>
        <title>{props.meetupData.title}</title>
        <meta name="description" content={props.meetupData.description} />
      </Head>
      <MeetupDetail
        image={props.meetupData.image}
        title={props.meetupData.title}
        address={props.meetupData.address}
        description={props.meetupData.description}
      />
    </>
  );
};

export async function getStaticPaths() {
  const client = await MongoClient.connect(MONGODB_STRING);
  const db = client.db();
  const meetupsCollection = db.collection('meetups');
  const meetups = await meetupsCollection.find({}, { _id: 1 }).toArray();
  client.close();

  return {
    fallback: false,
    paths: meetups.map((meetup) => ({ params: { meetupId: meetup._id.toString() } }))
  };
}

export async function getStaticProps(context) {
  const meetupId = context.params.meetupId;

  const client = await MongoClient.connect(MONGODB_STRING);
  const db = client.db();
  const meetupsCollection = db.collection('meetups');
  const selectedMeetup = await meetupsCollection.findOne({ _id: ObjectId(meetupId) });
  client.close();

  return {
    props: {
      meetupData: {
        id: selectedMeetup._id.toString(),
        title: selectedMeetup.data.title,
        address: selectedMeetup.data.address,
        image: selectedMeetup.data.image,
        description: selectedMeetup.data.description
      }
    }
  };
}

export default MeetupDetails;
