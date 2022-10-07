import React, { Component,useContext } from 'react';
import {COMMON_CONTEXT} from './COMMON/store';
import {
  HashRouter as Router,
  Route ,
  Redirect
} from "react-router-dom";

function RouteWithSubRoutes(route) {
  const {state} = useContext(COMMON_CONTEXT);
  return (
    
    <Route
        path={route.path}
        render={props => (
          // route.auth?.indexOf(Number(state.authCode))==-1?
          // <Redirect
          //   to={{
          //     pathname: "/liveDetail",
          //   }}
          // />:
          <route.component {...props} routes={route.routes} />
        )}
      />
    );
  }
  
  export default RouteWithSubRoutes;
