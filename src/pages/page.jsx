import React, {useState} from 'react';
import { documentToReactComponents } from '@contentful/rich-text-react-renderer';
import client from '../contentful-client';
import Loader from 'react-loaders'
import '../styles/page.css';
import { useEffect } from 'react';

function useContent(name){
  const [content, setContent] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [fetchError, setFetchError] = useState(false);

  useEffect(() => {

    setIsLoading(true);
    client.getEntries({ 
        content_type: 'page',
        'fields.name': name,
    }).then((entries) => {
        setFetchError(false);
        setIsLoading(false);
        setContent(documentToReactComponents(entries.items[0].fields.content));
    }).catch((err) => {
      setIsLoading(false);
      setFetchError(true);
    });

  }, [name]);

  return [content, isLoading, fetchError];
}

function Page(props) {
  const [content, isLoading] = useContent(props.name);

  return (
    <section className="page">
        {
          isLoading 
          ? <div className="designs__loading"><Loader color="black" active={true} type="cube-transition" /></div>
          : content
        }
    </section>
  );
}



export default Page;
