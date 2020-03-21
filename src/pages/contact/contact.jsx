import React, { useState } from 'react';
import API_URL from '../../api-url';
import Loader from 'react-loaders'
import '../../styles/page.css';

function useDescription(){
  const [description, setDescription] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [fetchError, setFetchError] = useState(false);

  fetch(API_URL + '/contact')
  .then(response => response.json())
  .then(data => {

      setFetchError(false);
      setIsLoading(false);
      setDescription(data.description);

  }).catch((err) => {      
      setIsLoading(false);
      setFetchError(true);
  });

  return [description, isLoading, fetchError];
}

function ContactPage(props) {
  const [description, isLoading] = useDescription();

  return (
    <section className="page">
        {/* <h1>About</h1>
        <p>
            Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.
        </p> */}

        {
          isLoading 
          ? <div className="designs__loading"><Loader color="black" active={true} type="cube-transition" /></div>
          : <div dangerouslySetInnerHTML={{ __html: description }}></div>
        }
    </section>
  );
}



export default ContactPage;
