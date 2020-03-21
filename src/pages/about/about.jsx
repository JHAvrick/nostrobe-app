import React, {useState} from 'react';
import { documentToReactComponents } from '@contentful/rich-text-react-renderer';
import client from '../../contentful-client';
import Loader from 'react-loaders'
import '../../styles/page.css';

function useContent(){
  const [content, setContent] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [fetchError, setFetchError] = useState(false);

  client.getEntry({ 
    content_type: 'page',
    'name': 'about',
  }).then((entry) => {
    setFetchError(false);
    setIsLoading(false);
    setContent(documentToReactComponents(entry.fields.content));
  }
  ).catch((err) => {
    setIsLoading(false);
    setFetchError(true);
  });

  return [content, isLoading, fetchError];
}

function AboutPage(props) {
  const [content, isLoading] = useContent();

  return (
    <section className="page">
        {
          isLoading 
          ? <div className="designs__loading"><Loader color="black" active={true} type="cube-transition" /></div>
          : content
          //: <div dangerouslySetInnerHTML={{ __html: description }}></div>
        }
    </section>
  );
}



export default AboutPage;
