import React, { useEffect, useState, useCallback, useRef } from 'react';
import PropTypes from 'prop-types';
import { Enums } from '@cornerstonejs/core';

function ViewportLoadingIndicator({ viewportData, element }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  const loadIndicatorRef = useRef(null);
  const imageIdToBeLoaded = useRef(null);

  const setLoadingStateScroll = useCallback(
    evt => {
      imageIdToBeLoaded.current = evt.detail.imageId;

      if (loading) {
        return;
      }

      setLoading(true);
    },
    [loading]
  );

  const setFinishLoadingState = evt => {
    setLoading(false);
  };

  const setErrorState = evt => {
    clearTimeout(loadIndicatorRef.current);

    if (imageIdToBeLoaded.current === evt.detail.imageId) {
      setError(evt.detail.error);
      imageIdToBeLoaded.current = null;
    }
  };

  useEffect(() => {
    element.addEventListener(Enums.Events.STACK_SCROLL, setLoadingStateScroll);
    element.addEventListener(Enums.Events.IMAGE_LOAD_ERROR, setErrorState);
    element.addEventListener(
      Enums.Events.STACK_NEW_IMAGE,
      setFinishLoadingState
    );

    return () => {
      element.removeEventListener(
        Enums.Events.STACK_SCROLL,
        setLoadingStateScroll
      );

      element.removeEventListener(
        Enums.Events.STACK_NEW_IMAGE,
        setFinishLoadingState
      );

      element.removeEventListener(Enums.Events.IMAGE_LOAD_ERROR, setErrorState);
    };
  }, [element, viewportData]);

  if (error) {
    return (
      <>
        <div className="bg-black opacity-50 absolute h-full w-full top-0 left-0">
          <div className="flex transparent items-center justify-center w-full h-full">
            <p className="text-primary-light text-xl font-light">
              <h4>Error Loading Image</h4>
              <p>An error has occurred.</p>
              <p>{error}</p>
            </p>
          </div>
        </div>
      </>
    );
  }

  if (loading) {
    return (
      // IMPORTANT: we need to use the pointer-events-none class to prevent the loading indicator from
      // interacting with the mouse, since scrolling should propagate to the viewport underneath
      <div className="pointer-events-none bg-black opacity-50 absolute h-full w-full top-0 left-0">
        <div className="flex transparent items-center justify-center w-full h-full">
          <p className="text-primary-light text-xl font-light">Loading...</p>
        </div>
      </div>
    );
  }

  return null;
}

ViewportLoadingIndicator.propTypes = {
  percentComplete: PropTypes.number,
  error: PropTypes.object,
  element: PropTypes.object,
};

ViewportLoadingIndicator.defaultProps = {
  percentComplete: 0,
  error: null,
};

export default ViewportLoadingIndicator;
