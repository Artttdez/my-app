import React, { useCallback, useEffect, useRef, useState } from 'react';
import { YMaps, Map, GeolocationControl, ZoomControl } from '@pbe/react-yandex-maps';
import { BottomSheet } from 'react-spring-bottom-sheet'
import { RefHandles } from 'react-spring-bottom-sheet/dist/types';
import { YMapsApi } from '@pbe/react-yandex-maps/typings/util/typing';
import { Breadcrumb, Breadcrumbs, Button, Link, Tab, TabList, TabPanel, Tabs } from 'react-aria-components';
import { QrReader } from 'react-qr-reader';

import "../../aria/Breadcrumbs.css";
import "../../aria/Button.css";

import 'react-spring-bottom-sheet/dist/style.css'
import './RouteGo.css';
import { useQuery } from 'react-query';
import { BACK_URL } from '../../contants';
import { useParams } from 'react-router-dom';
import LinesEllipsis from 'react-lines-ellipsis';

export const RouteGo = () => {
  const { id } = useParams();

  const { data } = useQuery<any>(
    'pipsusData',
    async () => {
        let cookie = "";
        const value = `; ${document.cookie}`;
        const parts = value.split(`; AUTH_SESSION=`);
        if (parts.length === 2) {
            cookie = String(parts?.pop()?.split(';').shift());
        };
   
      return await fetch(
        BACK_URL + 'api/routes/id/' + id + '',
        {
            headers: {
                "Access-Control-Allow-Origin": "*",
                "Content-Type": "application/json",
                "X-Auth-Session": cookie,
            },
            credentials: 'include',
          }
      ).then(res => res.json());
    },
    {
        useErrorBoundary: true,
    }
  );

  const [routeStatus, setRouteStatus] = useState<'start' | 'in_progress' | 'paused' | 'finished'>('start');

  if (!data?.places?.length) {
    return <span className="loader" />;;
  }

  return (
    <div className='RouteTabs'>
      <div className='RouteTabs-Breadcrumbs'>
      <Breadcrumbs>
        <Breadcrumb><Link href="/">Главная</Link></Breadcrumb>
        <Breadcrumb><Link href="/react-aria/">Мои планы</Link></Breadcrumb>
        <Breadcrumb><Link>Москва в июле</Link></Breadcrumb>
      </Breadcrumbs>
      </div>
      <h1 className='RouteTabs-Title'>Москва в июле</h1>
      <Tabs>
      <TabList aria-label="History of Ancient Rome">
        <Tab id="Plan">План</Tab>
        <Tab id="OnTrip">Маршрут</Tab>
        <Tab id="Book">Билеты и брони</Tab>
      </TabList>
        <TabPanel id="Plan">
          <RoutePlan route={data} routeStatus={routeStatus} setRouteStatus={value => { setRouteStatus(value)}}/>
        </TabPanel>
      <TabPanel id="OnTrip">
      <RouteOnTrip route={data} routeStatus={routeStatus} setRouteStatus={value => { setRouteStatus(value)}}/>
      </TabPanel>
      <TabPanel id="Book">
          
      </TabPanel>
    </Tabs>
    </div>
  );
}

export const RoutePlan = ({ route, routeStatus, setRouteStatus }: { route: any, routeStatus: 'start' | 'in_progress' | 'paused' | 'finished', setRouteStatus(value: 'start' | 'in_progress' | 'paused' | 'finished'): void }) => {
  const sheetRef = useRef<RefHandles>(null);


    const [api, setApi] = useState<YMapsApi>();
    const [points, setPoints] = useState<(number[] | string)[]>();
    const [routes, setRoutes] = useState<{ pedestrian: string, masstransit: string, driving: string} | null>(null);
    const [routeType, setRouteType] = useState<'pedestrian' | 'masstransit' | 'auto'>('pedestrian');

    const map = useRef<ymaps.Map | undefined>(undefined);
    const mapState = {
      center: [55.755805, 37.617549],
      zoom: 12
    };

    const addRoute = useCallback((ymaps: YMapsApi) => {
        setApi(ymaps);
      }, []);

    const getLetter = (number: number) => {
      // Define a mapping of numbers to letters
  const letterMap: { [key: string]: string } = {
    1: 'A',
    2: 'B',
    3: 'C',
    4: 'D',
    5: 'E',
    6: 'F',
    7: 'G',
    8: 'H',
    9: 'I',
    // Add more mappings as needed
  };

  // Return the corresponding letter for the input number
  return letterMap[number + 1];
    };


    useEffect(() => {
        if (map?.current && points && api) {
          const ROUTE_MAP = ['pedestrian', 'masstransit', 'auto'];
          ROUTE_MAP.forEach(type => {
            const multiRoute: any = new api.multiRouter.MultiRoute(
              {
                referencePoints: points,
                params: {
                  routingMode: type as 'pedestrian' | 'masstransit' | 'auto',
                }
              },
              {
                 // Внешний вид линии активного маршрута.
                routeActiveStrokeWidth: 4,
                routeActiveStrokeStyle: 'solid',
                routeActiveStrokeColor: "#002233",
                // Внешний вид линий альтернативных маршрутов.
                routeStrokeStyle: 'dot',
                routeStrokeWidth: 3,
                boundsAutoApply: true
              }
            );

          multiRoute.events.once('update', function () {
            // Set first non-blocked route as active and open it's balloon.
            var routes = multiRoute.getRoutes();
            for (var i = 0, l = routes.getLength(); i < l; i++) {
                var route = routes.get(i);
                console.log(route.properties.get("duration"))
                setRoutes(init => ({ ...init, [route.properties.get('type')]: String(route.properties.get("distance").text)}) as any);
            }
          });
          
          if (routeType === type) {
            map?.current?.geoObjects.removeAll();
            map?.current?.geoObjects.add(multiRoute);
          }
      })
        }
      }, [map, points, api, routeType, setRoutes]);

      const calcCrow = (lat1: number, lon1: number, lat2: number, lon2: number) =>
      {
        var R = 6371; // km
        var dLat = toRad(lat2-lat1);
        var dLon = toRad(lon2-lon1);
        var lat1 = toRad(lat1);
        var lat2 = toRad(lat2);
  
        var a = Math.sin(dLat/2) * Math.sin(dLat/2) +
          Math.sin(dLon/2) * Math.sin(dLon/2) * Math.cos(lat1) * Math.cos(lat2); 
        var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
        var d = R * c;
        return d;
      }
  
      // Converts numeric degrees to radians
      const toRad = (value: number) =>
      {
          return value * Math.PI / 180;
      }



    useEffect(() => {
      if (route.places) {
       setPoints(route?.places[0]?.map((item: any) => ([item.latitude, item.longitude])));
      }
    }, [route]);

    const [data, setData] = useState('Отсканируйте QR-код');
    const [result, setResult] = useState<'green' | 'red' | undefined>();

    return (
        <div style={{ position: "relative" }}>
            <YMaps query={{ apikey: '1d2d4e37-8ff6-4940-8ee3-6ba095c9e686', lang: 'ru_RU' }} >
              <Map
                modules={["multiRouter.MultiRoute"]}
                state={mapState}
                instanceRef={map}
                onLoad={addRoute}
                width={"100%"}
                height={800}
              >
                <GeolocationControl />
                <ZoomControl />
              </Map>
            </YMaps>
            <BottomSheet open={true} ref={sheetRef} footer={<div style={{ display: "flex", justifyContent: "center"}}>{
            routeStatus === 'start' &&
              <Button onPress={() => setRouteStatus('in_progress')}>
              Начать маршрут
            </Button>
            } 
            {
                (routeStatus === 'finished') && 'Маршрут завершён'
            } 
            </div>}
            snapPoints={({ maxHeight }) => [
                maxHeight - maxHeight / 5,
                maxHeight / 4,
                maxHeight / 10,
              ]}
            >
            <div className='SheetRoutes'>
              <div>
              <div className={`SheetRoute ${routeType === "pedestrian" ? 'SheetRoute-Active' : undefined}`} onClick={() => {setRouteType("pedestrian")}}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
<g clip-path="url(#clip0_2341_149515)">
<path d="M15.3365 23.0247L12.3773 17.457L10.0374 14.6722C9.69173 14.1277 9.50938 13.5068 9.50938 12.8743V7.60791M9.50938 7.60791H10.3262C10.6015 7.60785 10.8742 7.65828 11.1286 7.75633C11.383 7.85438 11.6142 7.99813 11.809 8.17936C12.0037 8.3606 12.1582 8.57577 12.2635 8.81258C12.3689 9.0494 12.4232 9.30322 12.4232 9.55956V17.457M9.50938 7.60791C7.56719 7.60791 5.625 11.2244 5.625 11.2244V14.6722M17.875 13.375L15 10.4375M6.4375 23L9.50938 18.8125" stroke="#1D1D1D" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M11.481 5C12.5855 5 13.481 4.10457 13.481 3C13.481 1.89543 12.5855 1 11.481 1C10.3764 1 9.48096 1.89543 9.48096 3C9.48096 4.10457 10.3764 5 11.481 5Z" stroke="#1D1D1D" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
</g>
<defs>
<clipPath id="clip0_2341_149515">
<rect width="24" height="24" fill="white"/>
</clipPath>
</defs>
</svg>
<div className='coin'>
                <div className='tails'></div>
                <div className='heads'></div>
              </div>
              </div>
              <div className="SheetRoutes-Distance">{routes?.["pedestrian"]}</div>
              </div>
              <div>
              <div className={`SheetRoute ${routeType === "auto" ? 'SheetRoute-Active' : undefined}`} onClick={() => {setRouteType("auto")}}>
              <svg width="25" height="24" viewBox="0 0 25 24" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M19.75 10V6.2C19.75 5.0799 19.75 4.51984 19.532 4.09202C19.3403 3.71569 19.0343 3.40973 18.658 3.21799C18.2302 3 17.6701 3 16.55 3H8.95C7.82989 3 7.26984 3 6.84202 3.21799C6.46569 3.40973 6.15973 3.71569 5.96799 4.09202C5.75 4.51984 5.75 5.0799 5.75 6.2V10M5.75 9H2.75V8M19.75 9H22.75V8M6.75 13.5H6.76M18.75 13.5H18.76M7.55 10H17.95C19.6302 10 20.4702 10 21.112 10.327C21.6765 10.6146 22.1354 11.0735 22.423 11.638C22.75 12.2798 22.75 13.1198 22.75 14.8V18C22.75 18.9319 22.75 19.3978 22.5978 19.7654C22.3948 20.2554 22.0054 20.6448 21.5154 20.8478C21.1478 21 20.6819 21 19.75 21H19.15C18.7784 21 18.5926 21 18.4371 20.9754C17.5813 20.8398 16.9102 20.1687 16.7746 19.3129C16.75 19.1574 16.75 18.9716 16.75 18.6C16.75 18.5071 16.75 18.4606 16.7438 18.4218C16.71 18.2078 16.5422 18.04 16.3282 18.0062C16.2894 18 16.2429 18 16.15 18H9.35C9.2571 18 9.21065 18 9.17178 18.0062C8.95784 18.04 8.79004 18.2078 8.75616 18.4218C8.75 18.4606 8.75 18.5071 8.75 18.6C8.75 18.9716 8.75 19.1574 8.72538 19.3129C8.58983 20.1687 7.91865 20.8398 7.06287 20.9754C6.9074 21 6.7216 21 6.35 21H5.75C4.81812 21 4.35218 21 3.98463 20.8478C3.49458 20.6448 3.10523 20.2554 2.90224 19.7654C2.75 19.3978 2.75 18.9319 2.75 18V14.8C2.75 13.1198 2.75 12.2798 3.07698 11.638C3.3646 11.0735 3.82354 10.6146 4.38803 10.327C5.02976 10 5.86984 10 7.55 10ZM7.25 13.5C7.25 13.7761 7.02614 14 6.75 14C6.47386 14 6.25 13.7761 6.25 13.5C6.25 13.2239 6.47386 13 6.75 13C7.02614 13 7.25 13.2239 7.25 13.5ZM19.25 13.5C19.25 13.7761 19.0261 14 18.75 14C18.4739 14 18.25 13.7761 18.25 13.5C18.25 13.2239 18.4739 13 18.75 13C19.0261 13 19.25 13.2239 19.25 13.5Z" stroke="#1D1D1D" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
</svg>
              </div>
              <div className="SheetRoutes-Distance">{routes?.["driving"]}</div>
              </div>
              <div>
              <div className={`SheetRoute ${routeType === "masstransit" ? 'SheetRoute-Active' : undefined}`} onClick={() => {setRouteType("masstransit")}}>
              <svg width="25" height="24" viewBox="0 0 25 24" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M9 19V21.2C9 21.48 9 21.62 8.9455 21.727C8.89757 21.8211 8.82108 21.8976 8.727 21.9455C8.62004 22 8.48003 22 8.2 22H6.3C6.01997 22 5.87996 22 5.773 21.9455C5.67892 21.8976 5.60243 21.8211 5.5545 21.727C5.5 21.62 5.5 21.48 5.5 21.2V19M19.5 19V21.2C19.5 21.48 19.5 21.62 19.4455 21.727C19.3976 21.8211 19.3211 21.8976 19.227 21.9455C19.12 22 18.98 22 18.7 22H16.8C16.52 22 16.38 22 16.273 21.9455C16.1789 21.8976 16.1024 21.8211 16.0545 21.727C16 21.62 16 21.48 16 21.2V19M3.5 12H21.5M3.5 5.5H21.5M7 15.5H8.5M16.5 15.5H18M8.3 19H16.7C18.3802 19 19.2202 19 19.862 18.673C20.4265 18.3854 20.8854 17.9265 21.173 17.362C21.5 16.7202 21.5 15.8802 21.5 14.2V6.8C21.5 5.11984 21.5 4.27976 21.173 3.63803C20.8854 3.07354 20.4265 2.6146 19.862 2.32698C19.2202 2 18.3802 2 16.7 2H8.3C6.61984 2 5.77976 2 5.13803 2.32698C4.57354 2.6146 4.1146 3.07354 3.82698 3.63803C3.5 4.27976 3.5 5.11984 3.5 6.8V14.2C3.5 15.8802 3.5 16.7202 3.82698 17.362C4.1146 17.9265 4.57354 18.3854 5.13803 18.673C5.77976 19 6.61984 19 8.3 19Z" stroke="#1D1D1D" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
</svg>

              </div>
              <div className="SheetRoutes-Distance">{routes?.["masstransit"]}</div>
              </div>
            </div>
            <div className='Marsh'>
              {route.places[0].map((item: any, id: number) => (
                <>
                <div className='MarshItem'>
                  <div style={{ width: "24px", height: "24px", display: "flex", alignItems: "center", justifyContent: "center", background: "#FFCF08", borderRadius: "100%"}}>{getLetter(id)}</div>
                 <div className='MarshImage' style={{ background: 'url(' + item.s3Album + ')' + ' no-repeat cover', width: "48px", height: "48px", borderRadius: "8px" }}  >
                 <img src={item.s3Album} style={{ width: "100%", height: "100%", objectFit: "cover",  borderRadius: "8px" }} />
                 </div>
             <div className='MarshContent'>
               <div className='MarshTitle'>{item.title}</div>
               <div className='MarshArea'>{item.metroStation}</div>
             </div>
             </div>
             {
              (id < route.places[0].length - 1) && <div className='MarshMove'>
                <div className='MarshIcon'>
                <svg className='MarshRoad' width="24" height="70" viewBox="0 0 24 70" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 1V69" stroke="#007470" stroke-width="2" stroke-linecap="round" stroke-dasharray="3 10"/>
                </svg>
                <svg className='MarshMan' width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
<g clip-path="url(#clip0_2352_149415)">
<rect width="24" height="24" fill="white"/>
<path d="M15.3365 23.0247L12.3773 17.457L10.0374 14.6722C9.69173 14.1277 9.50938 13.5068 9.50938 12.8743V7.60791M9.50938 7.60791H10.3262C10.6015 7.60785 10.8742 7.65828 11.1286 7.75633C11.383 7.85438 11.6142 7.99813 11.809 8.17936C12.0037 8.3606 12.1582 8.57577 12.2635 8.81258C12.3689 9.0494 12.4232 9.30322 12.4232 9.55956V17.457M9.50938 7.60791C7.56719 7.60791 5.625 11.2244 5.625 11.2244V14.6722M17.875 13.375L15 10.4375M6.4375 23L9.50938 18.8125" stroke="#007470" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M11.481 5C12.5855 5 13.481 4.10457 13.481 3C13.481 1.89543 12.5855 1 11.481 1C10.3764 1 9.48096 1.89543 9.48096 3C9.48096 4.10457 10.3764 5 11.481 5Z" stroke="#007470" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
</g>
<defs>
<clipPath id="clip0_2352_149415">
<rect width="24" height="24" fill="white"/>
</clipPath>
</defs>
</svg>
</div>

                <span className='MarshTime'>{Number((calcCrow(item.latitude, item.longitude, route.places[0][id + 1].latitude, route.places[0][id + 1].longitude)/0.1).toFixed(1))} минут</span>
              </div>
}</>))}
</div>
            </BottomSheet>
        </div>
    );
}

export const RouteOnTrip = ({ route, routeStatus, setRouteStatus }: { route: any, routeStatus: 'start' | 'in_progress' | 'paused' | 'finished', setRouteStatus(value: 'start' | 'in_progress' | 'paused' | 'finished'): void }) => {
  const [open, setOpen] = useState(true);

  const [currentPlace, setCurrentPlace] = useState(0);

  const [openQR, setOpenQR] = useState(false);

  const sheetRef = useRef<RefHandles>(null);

  const sheetQRRef = useRef<RefHandles>(null);

    const [api, setApi] = useState<YMapsApi>();
    const [points, setPoints] = useState<(number[] | string)[]>();
    const [routes, setRoutes] = useState<{ pedestrian: string, masstransit: string, driving: string} | null>(null);
    const routeType = 'pedestrian';

    const map = useRef<ymaps.Map | undefined>(undefined);
    const mapState = {
      center: [55.755805, 37.617549],
      zoom: 12
    };

    const addRoute = useCallback((ymaps: YMapsApi) => {
        setApi(ymaps);
      }, []);



    useEffect(() => {
        if (map?.current && points && api) {
          const ROUTE_MAP = ['pedestrian', 'masstransit', 'auto'];
          ROUTE_MAP.forEach(type => {
            const multiRoute: any = new api.multiRouter.MultiRoute(
              {
                referencePoints: points,
                params: {
                  routingMode: type as 'pedestrian' | 'masstransit' | 'auto',
                }
              },
              {
                 // Внешний вид линии активного маршрута.
                routeActiveStrokeWidth: 4,
                routeActiveStrokeStyle: 'solid',
                routeActiveStrokeColor: "#002233",
                // Внешний вид линий альтернативных маршрутов.
                routeStrokeStyle: 'dot',
                routeStrokeWidth: 3,
                boundsAutoApply: true
              }
            );
          
          if (routeType === type) {
            map?.current?.geoObjects.removeAll();
            map?.current?.geoObjects.add(multiRoute);
          }
      })
        }
      }, [map, points, api, routeType, setRoutes]);

      const calcCrow = (lat1: number, lon1: number, lat2: number, lon2: number) =>
      {
        var R = 6371; // km
        var dLat = toRad(lat2-lat1);
        var dLon = toRad(lon2-lon1);
        var lat1 = toRad(lat1);
        var lat2 = toRad(lat2);
  
        var a = Math.sin(dLat/2) * Math.sin(dLat/2) +
          Math.sin(dLon/2) * Math.sin(dLon/2) * Math.cos(lat1) * Math.cos(lat2); 
        var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
        var d = R * c;
        return d;
      }
  
      // Converts numeric degrees to radians
      const toRad = (value: number) =>
      {
          return value * Math.PI / 180;
      }

      const getLetter = (number: number) => {
        // Define a mapping of numbers to letters
    const letterMap: { [key: string]: string } = {
      1: 'A',
      2: 'B',
      3: 'C',
      4: 'D',
      5: 'E',
      6: 'F',
      7: 'G',
      8: 'H',
      9: 'I',
      // Add more mappings as needed
    };
  
    // Return the corresponding letter for the input number
    return letterMap[number + 1];
      };

    console.log(currentPlace);


    useEffect(() => {
      if (route.places) {
       setPoints(route.places[0].map((item: any) => ([item.latitude, item.longitude])));
      }
    }, [route]);

    const [rainRoutes, setRainRoutes] = useState<any>(undefined);

    const onRain = useCallback(() => {
      const reachedPlaces = route.places[0].slice(0, currentPlace);
      const unReachedPlaces = route.places[0].slice(currentPlace, route.places[0].length).filter((item: any) => Boolean(item.categories.some((category: any) => category === "indoors")));
      setPoints([...reachedPlaces, ...unReachedPlaces].map((item: any) => ([item.latitude, item.longitude])));
      setRainRoutes([...reachedPlaces, ...unReachedPlaces]);
    }, [route, currentPlace, setPoints]);

    const [data, setData] = useState('Отсканируйте QR-код');
    const [blockQR, setBlockQR] = useState(false); 
    const [result, setResult] = useState<'green' | 'red' | undefined>();

    const actualRoutes = rainRoutes !== undefined ? rainRoutes : route.places[0];

    return (
        <div style={{ position: "relative" }}>
            <YMaps query={{ apikey: '1d2d4e37-8ff6-4940-8ee3-6ba095c9e686', lang: 'ru_RU' }} >
              <Map
                modules={["multiRouter.MultiRoute"]}
                state={mapState}
                instanceRef={map}
                onLoad={addRoute}
                width={"100%"}
                height={800}
              >
                <GeolocationControl />
                <ZoomControl />
              </Map>
            </YMaps>
            <Button className="QRAction" onPress={() => { setOpenQR(true) }} isDisabled={routeStatus !== "in_progress"}>
            <svg width="24px" height="24px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
<g id="System / Qr_Code">
<path id="Vector" d="M19 20H20M16 20H14V17M17 17H20V14H19M14 14H16M4 16.9997C4 16.0679 4 15.6019 4.15224 15.2344C4.35523 14.7443 4.74432 14.3552 5.23438 14.1522C5.60192 14 6.06786 14 6.99974 14C7.93163 14 8.39808 14 8.76562 14.1522C9.25568 14.3552 9.64467 14.7443 9.84766 15.2344C9.9999 15.6019 9.9999 16.0681 9.9999 17C9.9999 17.9319 9.9999 18.3978 9.84766 18.7654C9.64467 19.2554 9.25568 19.6447 8.76562 19.8477C8.39808 19.9999 7.93162 19.9999 6.99974 19.9999C6.06786 19.9999 5.60192 19.9999 5.23438 19.8477C4.74432 19.6447 4.35523 19.2557 4.15224 18.7656C4 18.3981 4 17.9316 4 16.9997ZM14 6.99974C14 6.06786 14 5.60192 14.1522 5.23438C14.3552 4.74432 14.7443 4.35523 15.2344 4.15224C15.6019 4 16.0679 4 16.9997 4C17.9316 4 18.3981 4 18.7656 4.15224C19.2557 4.35523 19.6447 4.74432 19.8477 5.23438C19.9999 5.60192 19.9999 6.06812 19.9999 7C19.9999 7.93188 19.9999 8.39783 19.8477 8.76537C19.6447 9.25542 19.2557 9.64467 18.7656 9.84766C18.3981 9.9999 17.9316 9.9999 16.9997 9.9999C16.0679 9.9999 15.6019 9.9999 15.2344 9.84766C14.7443 9.64467 14.3552 9.25568 14.1522 8.76562C14 8.39808 14 7.93163 14 6.99974ZM4 6.99974C4 6.06786 4 5.60192 4.15224 5.23438C4.35523 4.74432 4.74432 4.35523 5.23438 4.15224C5.60192 4 6.06786 4 6.99974 4C7.93163 4 8.39808 4 8.76562 4.15224C9.25568 4.35523 9.64467 4.74432 9.84766 5.23438C9.9999 5.60192 9.9999 6.06812 9.9999 7C9.9999 7.93188 9.9999 8.39783 9.84766 8.76537C9.64467 9.25542 9.25568 9.64467 8.76562 9.84766C8.39808 9.9999 7.93162 9.9999 6.99974 9.9999C6.06786 9.9999 5.60192 9.9999 5.23438 9.84766C4.74432 9.64467 4.35523 9.25568 4.15224 8.76562C4 8.39808 4 7.93163 4 6.99974Z" stroke="#000000" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
</g>
</svg>

Я дошёл!
            </Button>
            {
              !openQR ?
            <BottomSheet open={true} ref={sheetRef} 
            header={<div style={{ display: "flex", justifyContent: "space-between"}}>
              <Button onPress={() => onRain()}>
              <div style={{ display: "flex", alignItems: "center", gap: "4px"}}>
              <svg width="18px" height="18px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
<path fill-rule="evenodd" clip-rule="evenodd" d="M5.99993 1C5.65276 1 5.36339 1.17976 5.16152 1.45177C5.09068 1.5478 4.92673 1.77255 4.709 2.08705C4.41942 2.50534 4.03176 3.08669 3.64247 3.73551C3.25505 4.38123 2.85535 5.11139 2.54959 5.82484C2.25681 6.50802 1.99893 7.24994 2 8.00206C2.00062 8.21313 2.02582 8.42526 2.06046 8.63311C2.11824 8.97986 2.23566 9.45747 2.48051 9.94719C2.72731 10.4408 3.11323 10.9649 3.71085 11.3633C4.31472 11.7659 5.07494 12 5.99994 12C6.92494 12 7.68516 11.7659 8.28904 11.3633C8.88666 10.9649 9.2726 10.4409 9.51942 9.94722C9.76428 9.45751 9.88173 8.9799 9.93952 8.63315C9.9742 8.42505 9.99972 8.21239 10 8.00101C10.0004 7.24888 9.74323 6.50811 9.45038 5.82482C9.14461 5.11137 8.7449 4.38121 8.35746 3.7355C7.96816 3.08668 7.58048 2.50533 7.29089 2.08703C7.07315 1.77254 6.9092 1.54779 6.83835 1.45175C6.63647 1.17975 6.3471 0.999997 5.99993 1ZM7.6121 6.61268C7.35536 6.01363 7.00506 5.36879 6.64248 4.7645C6.42198 4.39701 6.20087 4.05101 5.99996 3.74751C5.79905 4.05101 5.57796 4.397 5.35747 4.76449C4.99491 5.36877 4.64462 6.01361 4.38789 6.61266L4.37335 6.64657C4.19665 7.0585 3.98776 7.54548 4.00018 8.00042C4.01216 8.36034 4.1089 8.73181 4.26939 9.05281C4.39756 9.30917 4.57412 9.53511 4.82025 9.6992C5.06012 9.85912 5.4249 10 5.99994 10C6.57498 10 6.93977 9.85912 7.17966 9.69919C7.42581 9.5351 7.60238 9.30915 7.73057 9.05278C7.89107 8.73179 7.98784 8.3603 7.99982 8.00038C8.01225 7.54551 7.80337 7.05857 7.62668 6.64668L7.6121 6.61268Z" fill="#0F0F0F"/>
<path fill-rule="evenodd" clip-rule="evenodd" d="M17.9999 1C17.6528 1 17.3634 1.17976 17.1615 1.45177C17.0907 1.5478 16.9267 1.77255 16.709 2.08705C16.4194 2.50534 16.0318 3.08669 15.6425 3.73551C15.2551 4.38123 14.8554 5.11139 14.5496 5.82484C14.2568 6.50802 13.9989 7.24994 14 8.00206C14.0006 8.21313 14.0258 8.42526 14.0605 8.63311C14.1182 8.97986 14.2357 9.45747 14.4805 9.94719C14.7273 10.4408 15.1132 10.9649 15.7108 11.3633C16.3147 11.7659 17.0749 12 17.9999 12C18.9249 12 19.6852 11.7659 20.289 11.3633C20.8867 10.9649 21.2726 10.4409 21.5194 9.94722C21.7643 9.45751 21.8817 8.9799 21.9395 8.63315C21.9742 8.42505 21.9997 8.21239 22 8.00101C22.0004 7.24888 21.7432 6.50811 21.4504 5.82482C21.1446 5.11137 20.7449 4.38121 20.3575 3.7355C19.9682 3.08668 19.5805 2.50533 19.2909 2.08703C19.0732 1.77254 18.9092 1.54779 18.8384 1.45175C18.6365 1.17975 18.3471 0.999997 17.9999 1ZM19.6121 6.61268C19.3554 6.01363 19.0051 5.36879 18.6425 4.7645C18.422 4.39701 18.2009 4.05101 18 3.74751C17.7991 4.05101 17.578 4.397 17.3575 4.76449C16.9949 5.36877 16.6446 6.01361 16.3879 6.61266L16.3734 6.64656C16.1967 7.0585 15.9878 7.54548 16.0002 8.00042C16.0122 8.36034 16.1089 8.73181 16.2694 9.05281C16.3976 9.30917 16.5741 9.53511 16.8203 9.6992C17.0601 9.85912 17.4249 10 17.9999 10C18.575 10 18.9398 9.85912 19.1797 9.69919C19.4258 9.5351 19.6024 9.30915 19.7306 9.05278C19.8911 8.73179 19.9878 8.3603 19.9998 8.00038C20.0123 7.54552 19.8034 7.05858 19.6267 6.6467L19.6121 6.61268Z" fill="#0F0F0F"/>
<path fill-rule="evenodd" clip-rule="evenodd" d="M11.1615 12.4518C11.3634 12.1798 11.6528 12 11.9999 12C12.3471 12 12.6365 12.1797 12.8384 12.4518C12.9092 12.5478 13.0732 12.7725 13.2909 13.087C13.5805 13.5053 13.9682 14.0867 14.3575 14.7355C14.7449 15.3812 15.1446 16.1114 15.4504 16.8248C15.7432 17.5081 16.0004 18.2489 16 19.001C15.9997 19.2124 15.9742 19.4251 15.9395 19.6332C15.8817 19.9799 15.7643 20.4575 15.5194 20.9472C15.2726 21.4409 14.8867 21.9649 14.289 22.3633C13.6852 22.7659 12.9249 23 11.9999 23C11.0749 23 10.3147 22.7659 9.71085 22.3633C9.11323 21.9649 8.72731 21.4408 8.48051 20.9472C8.23566 20.4575 8.11824 19.9799 8.06046 19.6331C8.02582 19.4253 8.00062 19.2131 8 19.0021C7.99893 18.2499 8.25681 17.508 8.54959 16.8248C8.85535 16.1114 9.25505 15.3812 9.64247 14.7355C10.0318 14.0867 10.4194 13.5053 10.709 13.087C10.9267 12.7726 11.0907 12.5478 11.1615 12.4518ZM12.6425 15.7645C13.0051 16.3688 13.3554 17.0136 13.6121 17.6127C13.6169 17.624 13.6218 17.6353 13.6267 17.6467C13.8034 18.0586 14.0123 18.5455 13.9998 19.0004C13.9878 19.3603 13.8911 19.7318 13.7306 20.0528C13.6024 20.3091 13.4258 20.5351 13.1797 20.6992C12.9398 20.8591 12.575 21 11.9999 21C11.4249 21 11.0601 20.8591 10.8203 20.6992C10.5741 20.5351 10.3976 20.3092 10.2694 20.0528C10.1089 19.7318 10.0122 19.3603 10.0002 19.0004C9.98776 18.5455 10.1967 18.0585 10.3734 17.6466C10.3782 17.6352 10.3831 17.6239 10.3879 17.6127C10.6446 17.0136 10.9949 16.3688 11.3575 15.7645C11.578 15.397 11.7991 15.051 12 14.7475C12.2009 15.051 12.422 15.397 12.6425 15.7645Z" fill="#0F0F0F"/>
</svg>
            Дождь
            </div>
          </Button></div>} 
          footer={<div style={{ display: "flex", justifyContent: "center"}}>{
              (routeStatus === 'in_progress' || routeStatus === 'paused') &&
                <Button onPress={() => setRouteStatus('finished')}>
                Завершить маршрут
              </Button>
              }
              {
                (routeStatus === 'finished') && 'Маршрут завершён'
              } 
              </div>}
            snapPoints={({ maxHeight }) => [
                maxHeight - maxHeight / 5,
                maxHeight / 4,
                maxHeight / 10,
              ]}
            >
            <div className='Marsh'>
              {actualRoutes.map((item: any, id: number) => (
                <>
                <div className='MarshItem' style={{...(id === currentPlace && { background: "#F5F5F5", borderRadius: "12px", padding: "8px", alignItems: "flex-start", left: "-8px", width: "100%", position: "relative" })}}>
                <div style={{ width: "24px", height: "24px", display: "flex", alignItems: "center", justifyContent: "center", background: (routeStatus !== "start" && currentPlace > id) ? "green" : "#FFCF08", borderRadius: "100%"}}>{getLetter(id)}</div>
                 <div className='MarshImage' style={{ background: 'url(' + item.s3Album + ')' + ' no-repeat cover', ...(id === currentPlace ? {width: "72px", height: "72px"} : {width: "48px", height: "48px"}), borderRadius: "8px" }}  >
                 <img src={item.s3Album} style={{ width: "100%", height: "100%", objectFit: "cover",  borderRadius: "8px" }} />
                 </div>
             <div className='MarshContent'>
               <div className='MarshTitle'>{item.title}</div>
               <div className='MarshArea'>{item.metroStation}</div>
               {
                id === currentPlace &&
               <LinesEllipsis
                className='MarshCardDescription'
                text={item.description}
                maxLine='4'
                ellipsis='...'
                trimRight
                basedOn='letters'
                />
               }
                {
                  (id === currentPlace && item.price) && <Button style={{ marginTop: "12px"}}>
                    Купить за {item.price} рублей
                  </Button>
                }
             </div>
             </div>
             {
              (id < route.places[0].length - 1) && <div className='MarshMove'>
                <div className='MarshIcon'>
                <svg className='MarshRoad' width="24" height="70" viewBox="0 0 24 70" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 1V69" stroke="#007470" stroke-width="2" stroke-linecap="round" stroke-dasharray="3 10"/>
                </svg>
                <svg className='MarshMan' width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
<g clip-path="url(#clip0_2352_149415)">
<rect width="24" height="24" fill="white"/>
<path d="M15.3365 23.0247L12.3773 17.457L10.0374 14.6722C9.69173 14.1277 9.50938 13.5068 9.50938 12.8743V7.60791M9.50938 7.60791H10.3262C10.6015 7.60785 10.8742 7.65828 11.1286 7.75633C11.383 7.85438 11.6142 7.99813 11.809 8.17936C12.0037 8.3606 12.1582 8.57577 12.2635 8.81258C12.3689 9.0494 12.4232 9.30322 12.4232 9.55956V17.457M9.50938 7.60791C7.56719 7.60791 5.625 11.2244 5.625 11.2244V14.6722M17.875 13.375L15 10.4375M6.4375 23L9.50938 18.8125" stroke="#007470" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M11.481 5C12.5855 5 13.481 4.10457 13.481 3C13.481 1.89543 12.5855 1 11.481 1C10.3764 1 9.48096 1.89543 9.48096 3C9.48096 4.10457 10.3764 5 11.481 5Z" stroke="#007470" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
</g>
<defs>
<clipPath id="clip0_2352_149415">
<rect width="24" height="24" fill="white"/>
</clipPath>
</defs>
</svg>
</div>

                <span className='MarshTime'>{Number((calcCrow(item.latitude, item.longitude, route.places[0][id + 1].latitude, route.places[0][id + 1].longitude)/0.1).toFixed(1))} минут</span>
              </div>
             }
             </>
              ))}
            </div>  
            
            
            </BottomSheet> :
            <BottomSheet ref={sheetQRRef} open={openQR} snapPoints={({ maxHeight }) => [
                maxHeight - maxHeight / 5,
              ]}
            >
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center"}}>
              { !blockQR &&
              <QrReader
                onResult={(result, error) => {
                    if (!!result) {
                        setData(result?.getText() === route.places[0][currentPlace].verificationCode ? "Ура, вы получаете +10 баллов!" : "Неверный код, попробуйте еще раз");
                        setResult(result?.getText() === route.places[0][currentPlace].verificationCode ? "green" : "red");
                        if (route.places[0][currentPlace].verificationCode) {
                          setBlockQR(true);
                          setCurrentPlace(place => place + 1);
                        }
                    }

                    if (!!error) {
                        console.info(error);
                    }
                } }
                className='QR' constraints={{}}/>
              }
              {
                blockQR &&
                <svg width="72" height="72" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M21.5 13L14.1625 20L10.5 16.5M28 16C28 22.6274 22.6274 28 16 28C9.37258 28 4 22.6274 4 16C4 9.37258 9.37258 4 16 4C22.6274 4 28 9.37258 28 16Z" stroke="#039855" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
              }
              <p style={{ color: result }}>{data}</p>
              <Button style={{ margin: "0 auto" }} onPress={() => { setOpenQR(false); setResult(undefined); setData("Отсканируйте QR-код"); setBlockQR(false);}}>{result === 'green' ? "Ура, здорово!" : "Выйти"}</Button>
              </div>
            </BottomSheet>
          }
        </div>
    );
}