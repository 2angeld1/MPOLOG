import { IonTabs, IonRouterOutlet, IonTabBar, IonTabButton, IonIcon, IonLabel } from '@ionic/react';
import { Route, Redirect } from 'react-router-dom';
import { home, addCircle, statsChart } from 'ionicons/icons';
import Home from './Home';
import AddRecord from './AddRecord';
import Reports from './Reports';
import '../styles/Tabs.scss';

const Tabs: React.FC = () => {
    return (
        <IonTabs>
            <IonRouterOutlet>
                <Route exact path="/tabs/home">
                    <Home />
                </Route>
                <Route exact path="/tabs/add">
                    <AddRecord />
                </Route>
                <Route exact path="/tabs/reports">
                    <Reports />
                </Route>
                <Route exact path="/tabs">
                    <Redirect to="/tabs/home" />
                </Route>
            </IonRouterOutlet>
            <IonTabBar slot="bottom" className="custom-tab-bar">
                <IonTabButton tab="home" href="/tabs/home">
                    <IonIcon icon={home} />
                    <IonLabel>Inicio</IonLabel>
                </IonTabButton>
                <IonTabButton tab="add" href="/tabs/add" className="center-tab">
                    <div className="center-tab-icon">
                        <IonIcon icon={addCircle} />
                    </div>
                    <IonLabel>Agregar</IonLabel>
                </IonTabButton>
                <IonTabButton tab="reports" href="/tabs/reports">
                    <IonIcon icon={statsChart} />
                    <IonLabel>Reportes</IonLabel>
                </IonTabButton>
            </IonTabBar>
        </IonTabs>
    );
};

export default Tabs;