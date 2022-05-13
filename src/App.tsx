import { Layout, message } from 'antd';
import 'antd/dist/antd.min.css';
import React, { Suspense, useEffect } from 'react';
import { Provider, useDispatch, useSelector } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import './App.scss';
import { Breadcrumbs } from './components/common/Breadcrumbs/Breadcrumbs';
import Preloader from './components/common/Preloader/Preloader';
import FooterComponent from './components/Footer/Footer';
import AppHeader from './components/Header/Header';
import { RedirectHandler } from './components/RedirectHandler';
import SidebarContainer from './components/Sidebar/SidebarContainer';
import { initializeApp } from './redux/reducers/appReducer/appReducer';
import { selectInitialized } from './redux/reducers/appReducer/appSelectors';
import store from './redux/store';
import AppRoutes, { appRoutesRules } from './utils/redirectRules';

const { Content } = Layout;

const App: React.FC = () => {
  const initialized = useSelector(selectInitialized)
  const dispatch = useDispatch()

  const catchAllUnhandledErrors = (promiseRejectionEvent: PromiseRejectionEvent) => {
    message.error(promiseRejectionEvent.reason + " in " + promiseRejectionEvent.target);
  }
  useEffect(() => {
    dispatch(initializeApp());
    window.addEventListener("unhandledrejection", catchAllUnhandledErrors);

    return () => {
      window.removeEventListener("unhandledrejection", catchAllUnhandledErrors);
    }
  })
  if (!initialized) {
    return <Preloader />;
  }

  return (
    <Layout >
      <AppHeader />
      <Content className='container'>
        <Breadcrumbs />
        <Layout className="site-layout-background" style={{ paddingBottom: '24px' }}>
          <SidebarContainer />
          <Content style={{ padding: '0 12px', minHeight: 280 }}>
            <Suspense fallback={<Preloader />}>
              <RedirectHandler>
                <AppRoutes appRoutesRules={appRoutesRules} />
              </RedirectHandler>
            </Suspense>
          </Content>
        </Layout>
      </Content>
      <FooterComponent />
    </Layout>
  );
}

const SocialNetworkApp: React.FC = () => {
  return (
    <BrowserRouter basename={process.env.PUBLIC_URL}>
      <Provider store={store}>
        <App />
      </Provider>
    </BrowserRouter>
  );
};

export default SocialNetworkApp;
