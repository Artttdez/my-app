import React, { useCallback, useEffect, useRef, useState } from 'react';
import { TagGroup, Label, TagList, Tag, CheckboxGroup, Checkbox, Group, Button, Calendar, CalendarCell, CalendarGrid, DateInput, DatePicker, DateSegment, Dialog, Heading, Popover, DialogTrigger, OverlayArrow, Switch, ComboBox, Input, ListBox, ListBoxItem } from 'react-aria-components';
import LinesEllipsis from 'react-lines-ellipsis';
import { useMutation, useQuery } from 'react-query';

import TinderCard from 'react-tinder-card';
import { BACK_URL } from '../../contants';

import './RouteCreate.css';

const CATEGORIES = [
    {title: "История", value: 'history'},
    {title: "Экскурсии", value: 'excursion'},
    {title: "Рестораны", value: 'restaurant'},
    {title: "Кофейни", value: 'coffee'},
    {title: "Фестивали", value: 'festival'},
    {title: "События", value: 'events'},
    {title: "Концерты", value: 'concerts'},
    {title: "Перформансы", value: 'performance'},
    {title: "Представления", value: 'entertainment'},
    {title: "Выставки", value: 'exhibition'},
    {title: "Музеи", value: 'museum'},
    {title: "Лекции", value: 'lecture'},
    {title: "Маршруты", value: 'route'},
    {title: "Квесты", value: 'quest_item'}
]

const CATEGORIES_REQUIRED = [
    { title: "Маломобильные люди", value: "if_invalid" },
    { title: "С детьми", value: "if_kids" },
    { title: "С друзьями", value: "if_friends" },
]

const CustomRoute = ({ onCustomCreate, dateState } : { onCustomCreate: (result: any, data: any) => void, dateState?: string }) => {

    const [areaState, setAreaState] = useState<string | undefined>();
    const [requiredCategoriesState, setRequiredCategoriesState] = useState<string[] | undefined>([]);
    const [categoriesState, setCategoriesState] = useState<string[] | undefined>([]);
    const [minRatingState, setMinRatingState] = useState<number>(0);
    const [durationState, setDurationState] = useState<{ min: number, max: number } | undefined>();
    const [nameState, setNameState] = useState<string | undefined>();
    const [errorMessage, setErrorMessage] = useState<string | undefined>();

    const { data } = useQuery<any>(
        'pipoData',
        async () => {
            let cookie = "";
            const value = `; ${document.cookie}`;
            const parts = value.split(`; AUTH_SESSION=`);
            if (parts.length === 2) {
                cookie = String(parts?.pop()?.split(';').shift());
            };
       
          return await fetch(
            BACK_URL + 'api/places/landmarks',
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

      const { mutate: onLoadTinder } = useMutation(async (data: any) => {
        console.log(data);
        let cookie = "";
        const value = `; ${document.cookie}`;
        const parts = value.split(`; AUTH_SESSION=`);
        if (parts.length === 2) {
            cookie = String(parts?.pop()?.split(';').shift());
        };
    
      return await fetch(
        BACK_URL + 'api/places/filter',
        {
            method: "POST",
            headers: {
                "Access-Control-Allow-Origin": "*",
                "Content-Type": "application/json",
                "X-Auth-Session": cookie,
            },
            body: JSON.stringify(data.body),
            credentials: 'include',
          }
      ).then(res => res.json());
    }, {
        onSuccess: (result) => { 
            const area = data?.find((item: any) => item.title === areaState);
            onCustomCreate(result, { body: {
            date: dateState,
            area_or_metro_station: area ?? null,
            required_categories: requiredCategoriesState,
            interesting_categories: categoriesState,
            min_rating: minRatingState,
            expected_duration_hours_min: durationState?.min,
            expected_duration_hours_max: durationState?.max,
            friends_ids: [],
        }, name: nameState })},
        onError: () => { setErrorMessage("Заполните все поля!")},
    })

    const [searchedLocations, setSearchedLocations] = useState([]);

    const onSearchLocation = useCallback((text: string) => {
        if (text) {
            const result = data?.filter((item: any) => {
                const label = item.title;

                return label.toLocaleLowerCase().includes(text.toLocaleLowerCase());
            })
            setSearchedLocations(result);
        }
    }, [data, setSearchedLocations]);

      
    return (
        <div className="CustomRoute">
            <Label className='Label Label-Big'>
                    Фильтры
                </Label>
                <div className="CustomRoute-Filters" >
                    <div style={{ width: "calc(100% - 8px)" }}>
                    <Label className='Label'>Название</Label>
                    <Input className='Location' onChange={e => {
                        setNameState(e.target.value);
                    }} 
                    value={nameState}
                    />
                    </div>
  <ComboBox>
  <Label className='Label'>Где пройдёт</Label>
  <Group style={{ width: "calc(100% - 8px)" }} className='LocationWrapper'>
    <Input className='Location' onChange={e => {
        onSearchLocation(e.target.value);
        setAreaState(e.target.value);
    }} 
    />
    <Button className='LocationButton'>▼</Button>
  </Group>
  <Popover>
    <ListBox>
        {
            searchedLocations?.map((item: any) => (
                <ListBoxItem>{item.title}</ListBoxItem>
            ))
        }
    </ListBox>
  </Popover>
</ComboBox>
            <TagGroup selectionMode="multiple" onSelectionChange={(keys) => {
                const result = Array.from(keys)?.map((key) => {
                    const index = key.toString().slice(-1);
                    return CATEGORIES[Number(index) - 1].value;
                })
                setCategoriesState(result);
              }}>
                <Label className='Label'>
                    <svg width="25" height="24" viewBox="0 0 25 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M8.78565 8.28589H8.79395M3.80518 3.30542L3.80518 9.43255C3.80518 9.92106 3.80518 10.1653 3.8603 10.3952C3.90917 10.599 3.98977 10.7939 4.09916 10.9727C4.22255 11.1744 4.39509 11.3473 4.74017 11.693L13.7661 20.7371L21.2368 13.2664L11.2759 3.30542H3.80518ZM9.20069 8.28589C9.20069 8.51511 9.01487 8.70093 8.78565 8.70093C8.55643 8.70093 8.37061 8.51511 8.37061 8.28589C8.37061 8.05667 8.55643 7.87085 8.78565 7.87085C9.01487 7.87085 9.20069 8.05667 9.20069 8.28589Z" stroke="#1D1D1D" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
                    Категории
                </Label>
                    <TagList >
                        {
                            CATEGORIES.map(item => (
                                <Tag data-key={item.value}>{item.title}</Tag>
                            ))
                        }
                    </TagList>
            </TagGroup>
            <CheckboxGroup onChange={value => { setRequiredCategoriesState(value)}}>
  <Label className='Label'>
  <svg width="23" height="22" viewBox="0 0 23 22" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M5.52296 20.7053C5.52296 21.4233 6.10499 22.0053 6.82296 22.0053C7.54093 22.0053 8.12296 21.4233 8.12296 20.7053H5.52296ZM1.82141 10.0487V8.74866C1.10344 8.74866 0.521411 9.33069 0.521411 10.0487H1.82141ZM10.3303 1.80248L9.14236 1.2745C9.13953 1.28086 9.13675 1.28725 9.13403 1.29366L10.3303 1.80248ZM13.8004 8.11109H12.5004V9.41109H13.8004V8.11109ZM20.682 11.4594L21.9669 11.6571L20.682 11.4594ZM1.82141 20.7053H0.521411C0.521411 21.4233 1.10344 22.0053 1.82141 22.0053L1.82141 20.7053ZM19.6387 18.2409L18.3538 18.0432L19.6387 18.2409ZM8.12296 20.7053V10.0487H5.52296V20.7053H8.12296ZM16.7661 19.4053H1.82141V22.0053H16.7661V19.4053ZM19.3971 11.2617L18.3538 18.0432L20.9236 18.4386L21.9669 11.6571L19.3971 11.2617ZM13.8004 9.41109H17.8094V6.81109H13.8004V9.41109ZM12.5004 3.71846V8.11109H15.1004V3.71846H12.5004ZM8.01925 10.5575L11.5266 2.31129L9.13403 1.29366L5.62667 9.53985L8.01925 10.5575ZM3.12141 20.7053V10.0487H0.521411V20.7053H3.12141ZM1.82141 11.3487H6.82296V8.74866H1.82141V11.3487ZM11.058 0.0295899C10.2295 0.0295899 9.47882 0.517467 9.14236 1.2745L11.5183 2.33046C11.4374 2.51236 11.257 2.62959 11.058 2.62959V0.0295899ZM15.1004 3.71846C15.1004 2.57241 14.4862 1.63665 13.7544 1.02906C13.0232 0.422057 12.0495 0.0295899 11.058 0.0295899V2.62959C11.3858 2.62959 11.7833 2.77189 12.0936 3.02949C12.4031 3.2865 12.5004 3.54517 12.5004 3.71846H15.1004ZM21.9669 11.6571C22.3589 9.10902 20.3875 6.81109 17.8094 6.81109V9.41109C18.794 9.41109 19.5468 10.2886 19.3971 11.2617L21.9669 11.6571ZM16.7661 22.0053C18.8423 22.0053 20.6079 20.4906 20.9236 18.4386L18.3538 18.0432C18.2333 18.8268 17.559 19.4053 16.7661 19.4053V22.0053Z" fill="#1D1D1D"/>
</svg>
Особенности
</Label>
   {CATEGORIES_REQUIRED.map(item => (
    <Checkbox value={item.value}>
    <div className="checkbox" aria-hidden="true">
      <svg viewBox="0 0 18 18"><polyline points="1 9 7 14 15 4" /></svg>
    </div>
    {item.title}
  </Checkbox>
   ))}
</CheckboxGroup>
<TagGroup selectionMode="multiple" onSelectionChange={() => {}}>
                <Label className='Label'>
                    <svg width="25" height="24" viewBox="0 0 25 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M8.78565 8.28589H8.79395M3.80518 3.30542L3.80518 9.43255C3.80518 9.92106 3.80518 10.1653 3.8603 10.3952C3.90917 10.599 3.98977 10.7939 4.09916 10.9727C4.22255 11.1744 4.39509 11.3473 4.74017 11.693L13.7661 20.7371L21.2368 13.2664L11.2759 3.30542H3.80518ZM9.20069 8.28589C9.20069 8.51511 9.01487 8.70093 8.78565 8.70093C8.55643 8.70093 8.37061 8.51511 8.37061 8.28589C8.37061 8.05667 8.55643 7.87085 8.78565 7.87085C9.01487 7.87085 9.20069 8.05667 9.20069 8.28589Z" stroke="#1D1D1D" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
                    Категория отеля
                </Label>
                    <TagList>
                        <Tag>Без звезд</Tag>
                        <Tag>1</Tag>
                        <Tag>2</Tag>
                        <Tag>3</Tag>
                        <Tag>4</Tag>
                        <Tag>5</Tag>
                    </TagList>
            </TagGroup>
            <CheckboxGroup
            onChange={values => {
                if (values.length){
                    let minRealValue = 0;
                    const minValue = Math.min.apply(null, values.map(item => Number(item)));
                    if (minValue === 1) {
                        minRealValue = 1;
                    } else if (minValue === 2){
                        minRealValue = 1;
                    } else if (minValue === 5){
                        minRealValue = 2;
                    } else if (minValue === 12){
                        minRealValue = 6;
                    } 
                    setDurationState({ min: minRealValue, max: Math.max.apply(null, values.map(item => Number(item)))})
                    setMinRatingState(Math.min.apply(null, values.map(item => Number(item))));
                }
                else {
                    setDurationState(undefined);
                }
            }}
            >
            <Label className='Label'>
            <svg width="25" height="24" viewBox="0 0 25 24" fill="none" xmlns="http://www.w3.org/2000/svg">
<g clip-path="url(#clip0_2309_147285)">
<path d="M23.2571 13.377L24.3145 12.6207L22.8019 10.5059L21.7446 11.2622L23.2571 13.377ZM20.3291 13.8728L19.4817 14.8587L20.2554 15.5238L21.0853 14.9302L20.3291 13.8728ZM19.1285 11.1266L18.1426 10.2792L16.4478 12.2509L17.4337 13.0983L19.1285 11.1266ZM19.2902 13.2123C19.2113 13.9259 19.7258 14.5683 20.4394 14.6472C21.1531 14.7261 21.7955 14.2115 21.8744 13.4979L19.2902 13.2123ZM19.5787 18.9956L20.3965 17.985L18.3753 16.3495L17.5576 17.36L19.5787 18.9956ZM12.6196 8.11864V6.81864H10.0196V8.11864H12.6196ZM11.3196 12.3196H10.0196V12.8952L10.4458 13.2821L11.3196 12.3196ZM12.7697 15.3916L13.7323 16.2654L15.4798 14.3403L14.5172 13.4665L12.7697 15.3916ZM21.7446 11.2622L19.5728 12.8155L21.0853 14.9302L23.2571 13.377L21.7446 11.2622ZM21.1765 12.887L19.1285 11.1266L17.4337 13.0983L19.4817 14.8587L21.1765 12.887ZM11.3196 20.3392C6.89049 20.3392 3.3 16.7487 3.3 12.3196H0.7C0.7 18.1846 5.45455 22.9392 11.3196 22.9392V20.3392ZM3.3 12.3196C3.3 7.89049 6.89049 4.3 11.3196 4.3V1.7C5.45455 1.7 0.7 6.45455 0.7 12.3196H3.3ZM11.3196 4.3C15.7487 4.3 19.3392 7.89049 19.3392 12.3196H21.9392C21.9392 6.45455 17.1846 1.7 11.3196 1.7V4.3ZM19.3392 12.3196C19.3392 12.6218 19.3225 12.9196 19.2902 13.2123L21.8744 13.4979C21.9172 13.1106 21.9392 12.7174 21.9392 12.3196H19.3392ZM17.5576 17.36C16.0852 19.1795 13.8383 20.3392 11.3196 20.3392V22.9392C14.6562 22.9392 17.634 21.3989 19.5787 18.9956L17.5576 17.36ZM10.0196 8.11864V12.3196H12.6196V8.11864H10.0196ZM10.4458 13.2821L12.7697 15.3916L14.5172 13.4665L12.1933 11.357L10.4458 13.2821Z" fill="black"/>
</g>
<defs>
<clipPath id="clip0_2309_147285">
<rect width="24" height="24" fill="white" transform="translate(0.5)"/>
</clipPath>
</defs>
</svg>
Продолжительность
</Label>
  <Checkbox value="1">
    <div className="checkbox" aria-hidden="true">
      <svg viewBox="0 0 18 18"><polyline points="1 9 7 14 15 4" /></svg>
    </div>
    меньше часа
  </Checkbox>
  <Checkbox value="2">
    <div className="checkbox" aria-hidden="true">
      <svg viewBox="0 0 18 18"><polyline points="1 9 7 14 15 4" /></svg>
    </div>
    от 1 до 2 часов
  </Checkbox>
  <Checkbox value="5">
    <div className="checkbox" aria-hidden="true">
      <svg viewBox="0 0 18 18"><polyline points="1 9 7 14 15 4" /></svg>
    </div>
    от 2 до 5 часов
  </Checkbox>
  <Checkbox value="12">
    <div className="checkbox" aria-hidden="true">
      <svg viewBox="0 0 18 18"><polyline points="1 9 7 14 15 4" /></svg>
    </div>
    от 6 до 12 часов
  </Checkbox>
</CheckboxGroup>
<CheckboxGroup onChange={values => {
    if (values.length){
        setMinRatingState(Math.min.apply(null, values.map(item => Number(item))));
    }
    else {
        setMinRatingState(0);
    }
}}>
            <Label className='Label'>
            <svg width="25" height="24" viewBox="0 0 25 24" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M21.2092 22.0095H22.5092V19.4095H21.2092V22.0095ZM3.81836 20.7095H2.51836C2.51836 21.4274 3.10039 22.0095 3.81836 22.0095L3.81836 20.7095ZM5.11836 3.3186V2.0186H2.51836V3.3186H5.11836ZM21.2092 7.18324H22.5092V5.88324H21.2092V7.18324ZM12.5384 10.6862L13.3494 9.67018L12.441 8.94509L11.6191 9.76695L12.5384 10.6862ZM15.4123 12.9802L14.6013 13.9962L15.5097 14.7213L16.3315 13.8994L15.4123 12.9802ZM17.3446 5.88324H16.0446V8.48324H17.3446V5.88324ZM19.9092 11.0479V12.3479H22.5092V11.0479H19.9092ZM7.90642 13.4797L6.98718 14.3989L8.82566 16.2374L9.7449 15.3181L7.90642 13.4797ZM21.2092 19.4095H3.81836V22.0095H21.2092V19.4095ZM5.11836 20.7095V3.3186H2.51836V20.7095H5.11836ZM20.29 6.264L14.493 12.061L16.3315 13.8994L22.1285 8.10248L20.29 6.264ZM16.2233 11.9642L13.3494 9.67018L11.7274 11.7022L14.6013 13.9962L16.2233 11.9642ZM17.3446 8.48324H21.2092V5.88324H17.3446V8.48324ZM19.9092 7.18324V11.0479H22.5092V7.18324H19.9092ZM11.6191 9.76695L7.90642 13.4797L9.7449 15.3181L13.4576 11.6054L11.6191 9.76695Z" fill="#1D1D1D"/>
</svg>

Рейтинг
</Label>
  <Checkbox value="4">
    <div className="checkbox" aria-hidden="true">
      <svg viewBox="0 0 18 18"><polyline points="1 9 7 14 15 4" /></svg>
    </div>
    Превосходно: 4+
  </Checkbox>
  <Checkbox value="3">
    <div className="checkbox" aria-hidden="true">
      <svg viewBox="0 0 18 18"><polyline points="1 9 7 14 15 4" /></svg>
    </div>
    Очень хорошо: 3+
  </Checkbox>
  <Checkbox value="2">
    <div className="checkbox" aria-hidden="true">
      <svg viewBox="0 0 18 18"><polyline points="1 9 7 14 15 4" /></svg>
    </div>
    Хорошо: 2+
  </Checkbox>
  <Checkbox value="1">
    <div className="checkbox" aria-hidden="true">
      <svg viewBox="0 0 18 18"><polyline points="1 9 7 14 15 4" /></svg>
    </div>
    Достаточно хорошо: 1+
  </Checkbox>
</CheckboxGroup>
{errorMessage && <div style={{ color: "red"}}>{errorMessage}</div>}
<Button onPress={() => {
    const area = data?.find((item: any) => item.title === areaState);
    setErrorMessage(undefined);
    onLoadTinder({ body: {
        date: dateState,
        area_or_metro_station: area ?? null,
        required_categories: requiredCategoriesState,
        interesting_categories: categoriesState,
        min_rating: minRatingState,
        expected_duration_hours_min: durationState?.min,
        expected_duration_hours_max: durationState?.max,
        friends_ids: [],
    }, name: nameState });
    }}>
    Построить маршрут
</Button>
        </div>
    </div>
    )
}

export const RouteTinder = ({places, filters}: {places: any[], filters: any}) => {
    const characters = places;
    const kok = useRef(null);
    const [cardTop, setCardTop] = useState(characters.length - 1);
    const [blackList, setBlackList] = useState<any[]>([]);
    const [whiteList, setWhiteList] = useState<any[]>([]);

    console.log(filters);
  
    const swiped = (direction: 'left' | 'right' | 'up' | 'down', placeToSwipe: any) => {
        setCardTop(id => id - 1);
        if (direction === 'left') {
            setBlackList([...blackList, placeToSwipe]);
        }
        if (direction === 'right') {
            setWhiteList([...whiteList, placeToSwipe]);
        }
    }

    const { mutate: onFinalizeRoute } = useMutation(async (data: any) => {
        let cookie = "";
        const value = `; ${document.cookie}`;
        const parts = value.split(`; AUTH_SESSION=`);
        if (parts.length === 2) {
            cookie = String(parts?.pop()?.split(';').shift());
        };

        console.log(data, 33);
    
      return await fetch(
        BACK_URL + 'api/routes/',
        {
            method: "POST",
            headers: {
                "Access-Control-Allow-Origin": "*",
                "Content-Type": "application/json",
                "X-Auth-Session": cookie,
            },
            body: JSON.stringify(data),
            credentials: 'include',
          }
      ).then(res => res.json());
    }, {
        onSuccess: (result) => { console.log(22); },
    })

    useEffect(() => {
        setCardTop(places.length - 1);
    }, [places]);
  
      return (
        <div className='TinderCardContainer'>
        <div className='TinderBackground'>
        <div className='TinderBackground-Left'>
        <svg width="20" height="25" viewBox="0 0 20 25" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M19.5312 5.46875L5.46875 19.5312M19.5312 19.5312L5.46875 5.46875" stroke="black" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
        </div>
        <Button onPress={() => {onFinalizeRoute({
            places: whiteList ?? [],
            name: filters.name,
            places_blacklist: blackList ?? [],
            filter: filters.body,
        })}}>
            Завершить выбор
        </Button>
        <div className='TinderBackground-Right'>
        <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M21.5 13L14.1625 20L10.5 16.5M28 16C28 22.6274 22.6274 28 16 28C9.37258 28 4 22.6274 4 16C4 9.37258 9.37258 4 16 4C22.6274 4 28 9.37258 28 16Z" stroke="#039855" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
        </div>
        </div>
        <div className='TinderBackground-Placeholder'>
            На этом - всё, пошли&nbsp;гулять&nbsp;😊 
        </div>
        {characters.map((character, id) =>
          <TinderCard ref={kok} className='swipe' key={character.title} onSwipe={(dir) => swiped(dir, character)}>
            <div className={`TinderCard ${id === cardTop ? "TinderCard-Top" : undefined}`}>
            <div className='TinderImage' style={{ background: 'url(' + character.s3Album + ')' + ' no-repeat cover', width: "100%", height: "200px" }}  >
                <img src={character.s3Album} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                </div>
            <div className='TinderContent'>
              <div className='TinderTitle'>{character.title}</div>
            <div className='TinderParams'>
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M14.4197 2.60309H15.0197C15.0197 2.27172 14.751 2.00309 14.4197 2.00309V2.60309ZM14.4197 4.84517V5.44517C14.751 5.44517 15.0197 5.17654 15.0197 4.84517H14.4197ZM1.60133 2.60309V2.00309C1.26996 2.00309 1.00133 2.27172 1.00133 2.60309H1.60133ZM1.60133 4.84517H1.00133C1.00133 5.17654 1.26996 5.44517 1.60133 5.44517V4.84517ZM13.8197 2.60309V4.84517H15.0197V2.60309H13.8197ZM14.4197 4.24517H12.5311V5.44517H14.4197V4.24517ZM10.9356 8.01125C10.9441 7.94565 10.997 7.78353 11.1468 7.64129C11.2818 7.51304 11.5288 7.36934 11.9858 7.36934V6.16934C11.2471 6.16934 10.6965 6.41399 10.3204 6.77117C9.95904 7.11437 9.78722 7.53478 9.74553 7.85752L10.9356 8.01125ZM8.01051 3.20309H14.4197V2.00309H8.01051V3.20309ZM12.5311 4.24517H8.01051V5.44517H12.5311V4.24517ZM10.3406 7.33439H9.25413V8.53439H10.3406V7.33439ZM9.25413 7.33439H8.0105V8.53439H9.25413V7.33439ZM9.85413 13.0073V7.93439H8.65413V13.0073H9.85413ZM15.0197 7.92271V7.41065H13.8197V7.92271H15.0197ZM12.1056 13.0073V9.76784H10.9056V13.0073H12.1056ZM12.1056 9.76784V9.70886H10.9056V9.76784H12.1056ZM15.0197 7.41065C15.0197 6.03929 14.0924 4.60716 12.6728 4.26215L12.3894 5.4282C13.1865 5.62193 13.8197 6.50084 13.8197 7.41065H15.0197ZM9.74059 7.93439C9.74059 8.98615 10.3611 9.89036 11.2491 10.3103L11.7621 9.22542C11.2749 8.99502 10.9406 8.50173 10.9406 7.93439H9.74059ZM11.2491 10.3103C11.5912 10.472 11.9731 10.5623 12.3743 10.5623V9.36226C12.1546 9.36226 11.9474 9.31305 11.7621 9.22542L11.2491 10.3103ZM12.3743 10.5623C13.8298 10.5623 15.0197 9.38273 15.0197 7.92271H13.8197C13.8197 8.71552 13.1715 9.36226 12.3743 9.36226V10.5623ZM1.00133 2.60309V4.84517H2.20133V2.60309H1.00133ZM1.60133 5.44517H3.48987V4.24517H1.60133V5.44517ZM6.27545 7.85752C6.23376 7.53478 6.06194 7.11437 5.70057 6.77117C5.32449 6.41399 4.77392 6.16934 4.03515 6.16934V7.36934C4.49218 7.36934 4.73915 7.51304 4.87419 7.64129C5.02396 7.78353 5.07686 7.94565 5.08533 8.01125L6.27545 7.85752ZM8.01051 2.00309H1.60133V3.20309H8.01051V2.00309ZM3.48987 5.44517H8.01051V4.24517H3.48987V5.44517ZM5.68039 8.53439H6.76685V7.33439H5.68039V8.53439ZM6.76685 8.53439H8.0105V7.33439H6.76685V8.53439ZM7.36685 13.0073V7.93439H6.16685V13.0073H7.36685ZM2.20132 7.92271V7.41065H1.00132V7.92271H2.20132ZM5.11535 13.0073V9.76784H3.91535V13.0073H5.11535ZM5.11535 9.76784V9.70886H3.91535V9.76784H5.11535ZM2.20132 7.41065C2.20132 6.50085 2.83448 5.62193 3.63158 5.4282L3.34817 4.26215C1.92863 4.60716 1.00132 6.03928 1.00132 7.41065H2.20132ZM5.08039 7.93439C5.08039 8.50173 4.74612 8.99503 4.25886 9.22543L4.77183 10.3103C5.65983 9.89036 6.28039 8.98615 6.28039 7.93439H5.08039ZM4.25886 9.22543C4.07356 9.31305 3.86641 9.36226 3.64671 9.36226V10.5623C4.04782 10.5623 4.42982 10.472 4.77183 10.3103L4.25886 9.22543ZM3.64671 9.36226C2.84944 9.36226 2.20132 8.71552 2.20132 7.92271H1.00132C1.00132 9.38273 2.19117 10.5623 3.64671 10.5623V9.36226Z" fill="#1D1D1D"/>
            </svg>
              <TagGroup selectionMode='none' onSelectionChange={() => {}}>
                    <TagList>
                        <Tag>Музей</Tag>
                    </TagList>
            </TagGroup>
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M8.33281 8.63529C9.3585 8.63529 10.19 7.80381 10.19 6.77812C10.19 5.75244 9.3585 4.92096 8.33281 4.92096C7.30713 4.92096 6.47565 5.75244 6.47565 6.77812C6.47565 7.80381 7.30713 8.63529 8.33281 8.63529Z" stroke="#1D1D1D" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round"/>
                <path d="M8.33281 14.2068C10.809 11.7306 13.2853 9.51328 13.2853 6.77812C13.2853 4.04297 11.068 1.82568 8.33281 1.82568C5.59765 1.82568 3.38037 4.04297 3.38037 6.77812C3.38037 9.51328 5.85659 11.7306 8.33281 14.2068Z" stroke="#1D1D1D" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
            <span className='TinderParams'>
                {character.area}
            </span>
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M2.60544 13.4091L4.41907 2.60352H4.74017L7.73644 12.4028H8.37864L11.1622 2.60352H11.4833L13.5229 13.4013M1 13.4092L4.13056 13.4092M11.8932 13.4013L15 13.4013" stroke="#1D1D1D" stroke-width="1.2"/>
            </svg>
            <span className='TinderParams'>
                {character.metroStation}
            </span>
            </div>
              <LinesEllipsis
                className='TinderCardDescription'
                text={character.description}
                maxLine='4'
                ellipsis='...'
                trimRight
                basedOn='letters'
                />
            </div>
            </div>
          </TinderCard>
        )}
      </div>
      )
}

export const RouteCreateToggle = ({ setDate, isCustomRoute, setIsCustomRoute }: { setDate: any, isCustomRoute: boolean, setIsCustomRoute(value: boolean): void }) => {

    return (
        
        <div className='RouteCreate-Inside'>
            <div>
            <Label className='Label Label-Big'>
                    Маршруты
                </Label>
                <div className='Toggle'>
            <Button className={isCustomRoute ? "Toggle-Transparent" : undefined} onPress={() => setIsCustomRoute(false)}>
    Готовые&nbsp;маршруты
</Button>
<Button className={isCustomRoute ? undefined : "Toggle-Transparent"} onPress={() => setIsCustomRoute(true)}>
    Свой маршрут
</Button>
</div>
<DatePicker style={{ marginTop: "4px" }} onChange={value => setDate(value.toString())}>
  <Group style={{ width: "calc(100% - 8px)" }}>
    <DateInput>
      {(segment) => <DateSegment segment={segment} />}
    </DateInput>
    <Button>▼</Button>
  </Group>
  <Popover>
    <Dialog>
      <Calendar>
        <header>
          <Button slot="previous">◀</Button>
          <Heading />
          <Button slot="next">▶</Button>
        </header>
        <CalendarGrid>
          {(date) => <CalendarCell date={date} />}
        </CalendarGrid>
      </Calendar>
    </Dialog>
  </Popover>
</DatePicker>
            </div>
</div>
    );
}

export const RoutesReady = () => {

    const { data } = useQuery<any>(
        'pipsiData',
        async () => {
            let cookie = "";
            const value = `; ${document.cookie}`;
            const parts = value.split(`; AUTH_SESSION=`);
            if (parts.length === 2) {
                cookie = String(parts?.pop()?.split(';').shift());
            };
       
          return await fetch(
            BACK_URL + 'api/routes/my',
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

    if (!data?.length) {
        return <span>Загрузка...</span>;
    }

    return (
        <div style={{ paddingBottom: "8px" }}>
            {data?.map((item: any) => (
                <div className={'RouteSmallCard'}>
                    <div className={'RouteSmallTags'}>
                    <TagGroup selectionMode='none' onSelectionChange={() => {}}>
                    <TagList>
                        {
                            item.rating &&
                                <Tag style={{ backgroundColor: "green"}}>Рейтинг {item.rating}</Tag>
                        }
                        <Tag style={{ backgroundColor: "orange"}}>+{item.bonusForRoute} баллов</Tag>
                    </TagList>
                    </TagGroup>
                    </div>
                <div className='RouteSmallImage' style={{ width: "100%", height: "200px" }}  >
                <img src={item.places[0][0].s3Album} style={{ width: "100%", height: "100%", objectFit: "cover", borderTopLeftRadius: "16px", borderTopRightRadius: "16px" }} />
                </div>
            <div className='RouteSmallContent'>
              <div className='RouteSmallTitle'>{item.title}</div>
            <div className='RouteSmallParams'>
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M8.33281 8.63529C9.3585 8.63529 10.19 7.80381 10.19 6.77812C10.19 5.75244 9.3585 4.92096 8.33281 4.92096C7.30713 4.92096 6.47565 5.75244 6.47565 6.77812C6.47565 7.80381 7.30713 8.63529 8.33281 8.63529Z" stroke="#1D1D1D" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round"/>
                <path d="M8.33281 14.2068C10.809 11.7306 13.2853 9.51328 13.2853 6.77812C13.2853 4.04297 11.068 1.82568 8.33281 1.82568C5.59765 1.82568 3.38037 4.04297 3.38037 6.77812C3.38037 9.51328 5.85659 11.7306 8.33281 14.2068Z" stroke="#1D1D1D" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
            <span className='RouteSmallParams'>
                {item.city}
            </span>
            </div>
            <LinesEllipsis
                className='TinderCardDescription'
                text={item?.description}
                maxLine='4'
                ellipsis='...'
                trimRight
                basedOn='letters'
                />
            </div>
            </div>
            ))}
        </div>
    );
}

export const RouteCreate = () => {
    const [isTinder, setIsTinder] = useState(false);
    const [places, setPlaces] = useState([]);
    const [filters, setFilters] = useState();
    const [dateState, setDateState] = useState();
    const [isCustomRoute, setIsCustomRoute] = useState(true);

    return (
    <div className='RouteCreate'>
        { !isTinder &&
    <RouteCreateToggle setDate={setDateState} isCustomRoute={isCustomRoute} setIsCustomRoute={value => { setIsCustomRoute(value)}}/>
        }
    { isCustomRoute ?
    <>
    {
    isTinder ? 
        <RouteTinder places={places} filters={filters}/> :
        <CustomRoute dateState={dateState} onCustomCreate={(value, data) => { console.log(value, data); setIsTinder(true); setPlaces(value); setFilters(data) }}/>
    }
    </> : 
    <RoutesReady/>}
    </div>
    );
};
