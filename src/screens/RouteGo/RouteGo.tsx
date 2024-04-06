import React, { useCallback, useEffect, useRef, useState } from 'react';
import { YMaps, Map, GeolocationControl } from '@pbe/react-yandex-maps';
import { BottomSheet } from 'react-spring-bottom-sheet'
import { RefHandles } from 'react-spring-bottom-sheet/dist/types';
import { YMapsApi } from '@pbe/react-yandex-maps/typings/util/typing';
import { QrReader } from 'react-qr-reader';

import 'react-spring-bottom-sheet/dist/style.css'
import './RouteGo.css';

export const RouteGo = () => {
    const [open, setOpen] = useState(false);
    const sheetRef = useRef<RefHandles>(null);
    const [data, setData] = useState('No result');

    const [api, setApi] = useState<YMapsApi>();
    const [points, setPoints] = useState<(number[] | string)[]>();

    const map = useRef<ymaps.Map | undefined>(undefined);
    const mapState = {
      center: [59.949002, 30.327143],
      zoom: 12
    };

    const addRoute = useCallback((ymaps: YMapsApi) => {
        setApi(ymaps);
      }, []);


    useEffect(() => {
        if (map?.current && points && api) {
          const multiRoute: any = new api.multiRouter.MultiRoute(
            {
              referencePoints: points,
              params: {
                routingMode: "masstransit"
              }
            },
            {
              // Внешний вид путевых точек.
    wayPointStartIconColor: "#FFFFFF",
    wayPointStartIconFillColor: "#B3B3B3",
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
          map.current.geoObjects.removeAll();
          map.current.geoObjects.add(multiRoute as any);
        }
      }, [map, points, api]);


    useEffect(() => {
       setPoints([[59.956435, 30.308726], [59.972370, 30.301980]]);
    }, []);

    return (
        <div>
            <QrReader
                onResult={(result, error) => {
                    if (!!result) {
                        setData(result?.getText());
                    }

                    if (!!error) {
                        console.info(error);
                    }
                } }
                className='KOK' constraints={{}}/>
      <p>{data}</p>

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
              </Map>
            </YMaps>
            <BottomSheet open={open} ref={sheetRef} footer={<div>fdfvdfvdf</div>}
            snapPoints={({ maxHeight }) => [
                maxHeight - maxHeight / 10,
                maxHeight / 4,
                maxHeight / 10,
              ]}
            >
            <button
        onClick={() => {
          // Full typing for the arguments available in snapTo, yay!!
          sheetRef?.current?.snapTo(({ maxHeight }) => maxHeight)
        }}
      >
        Expand to full height
      </button>
            My awesome content here
            My awesome content here

            My awesome content hereMy awesome content here
            My awesome content here

            My awesome content hereMy awesome content hereMy awesome content here

            My awesome content here
            My awesome content here
            My awesome content here
            
            
            </BottomSheet>
        </div>
    );
}