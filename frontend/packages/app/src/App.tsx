import React, { FC } from 'react';
import * as plugins from './plugins';
import { 
  createApp,
  SidebarPage,
} from '@backstage/core';
import { AppSidebar } from './sidebar';

const app = createApp({
  plugins: Object.values(plugins),
});

const AppProvider = app.getProvider();
const AppRouter = app.getRouter();
const AppRoutes = app.getRoutes();

const App: FC<{}> = () => (
  <AppProvider>
    <AppRouter>
      <SidebarPage>
        <AppSidebar />
        <AppRoutes />
      </SidebarPage>
    </AppRouter>
  </AppProvider>
);

export default App;
