import React, { useState } from 'react';
import { TagGroup, Label, TagList, Tag, CheckboxGroup, Checkbox, Group, Button, Calendar, CalendarCell, CalendarGrid, DateInput, DatePicker, DateSegment, Dialog, Heading, Popover } from 'react-aria-components';

import './RouteCreate.css';

const CustomRoute = () => {
    return (
        <div className="CustomRoute">
            <Label className='Label Label-Big'>
                    Фильтры
                </Label>
                <div className="CustomRoute-Filters">
            <TagGroup selectionMode="multiple" onSelectionChange={() => {}}>
                <Label className='Label'>
                    <svg width="25" height="24" viewBox="0 0 25 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M8.78565 8.28589H8.79395M3.80518 3.30542L3.80518 9.43255C3.80518 9.92106 3.80518 10.1653 3.8603 10.3952C3.90917 10.599 3.98977 10.7939 4.09916 10.9727C4.22255 11.1744 4.39509 11.3473 4.74017 11.693L13.7661 20.7371L21.2368 13.2664L11.2759 3.30542H3.80518ZM9.20069 8.28589C9.20069 8.51511 9.01487 8.70093 8.78565 8.70093C8.55643 8.70093 8.37061 8.51511 8.37061 8.28589C8.37061 8.05667 8.55643 7.87085 8.78565 7.87085C9.01487 7.87085 9.20069 8.05667 9.20069 8.28589Z" stroke="#1D1D1D" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
                    Категории
                </Label>
                    <TagList>
                        <Tag>Культура</Tag>
                        <Tag>История</Tag>
                        <Tag>Отели</Tag>
                        <Tag>Рестораны</Tag>
                        <Tag>Апартаменты</Tag>
                    </TagList>
            </TagGroup>
            <CheckboxGroup>
  <Label className='Label'>
  <svg width="23" height="22" viewBox="0 0 23 22" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M5.52296 20.7053C5.52296 21.4233 6.10499 22.0053 6.82296 22.0053C7.54093 22.0053 8.12296 21.4233 8.12296 20.7053H5.52296ZM1.82141 10.0487V8.74866C1.10344 8.74866 0.521411 9.33069 0.521411 10.0487H1.82141ZM10.3303 1.80248L9.14236 1.2745C9.13953 1.28086 9.13675 1.28725 9.13403 1.29366L10.3303 1.80248ZM13.8004 8.11109H12.5004V9.41109H13.8004V8.11109ZM20.682 11.4594L21.9669 11.6571L20.682 11.4594ZM1.82141 20.7053H0.521411C0.521411 21.4233 1.10344 22.0053 1.82141 22.0053L1.82141 20.7053ZM19.6387 18.2409L18.3538 18.0432L19.6387 18.2409ZM8.12296 20.7053V10.0487H5.52296V20.7053H8.12296ZM16.7661 19.4053H1.82141V22.0053H16.7661V19.4053ZM19.3971 11.2617L18.3538 18.0432L20.9236 18.4386L21.9669 11.6571L19.3971 11.2617ZM13.8004 9.41109H17.8094V6.81109H13.8004V9.41109ZM12.5004 3.71846V8.11109H15.1004V3.71846H12.5004ZM8.01925 10.5575L11.5266 2.31129L9.13403 1.29366L5.62667 9.53985L8.01925 10.5575ZM3.12141 20.7053V10.0487H0.521411V20.7053H3.12141ZM1.82141 11.3487H6.82296V8.74866H1.82141V11.3487ZM11.058 0.0295899C10.2295 0.0295899 9.47882 0.517467 9.14236 1.2745L11.5183 2.33046C11.4374 2.51236 11.257 2.62959 11.058 2.62959V0.0295899ZM15.1004 3.71846C15.1004 2.57241 14.4862 1.63665 13.7544 1.02906C13.0232 0.422057 12.0495 0.0295899 11.058 0.0295899V2.62959C11.3858 2.62959 11.7833 2.77189 12.0936 3.02949C12.4031 3.2865 12.5004 3.54517 12.5004 3.71846H15.1004ZM21.9669 11.6571C22.3589 9.10902 20.3875 6.81109 17.8094 6.81109V9.41109C18.794 9.41109 19.5468 10.2886 19.3971 11.2617L21.9669 11.6571ZM16.7661 22.0053C18.8423 22.0053 20.6079 20.4906 20.9236 18.4386L18.3538 18.0432C18.2333 18.8268 17.559 19.4053 16.7661 19.4053V22.0053Z" fill="#1D1D1D"/>
</svg>
Особенности
</Label>
  <Checkbox value="invalid">
    <div className="checkbox" aria-hidden="true">
      <svg viewBox="0 0 18 18"><polyline points="1 9 7 14 15 4" /></svg>
    </div>
    Маломобильные люди
  </Checkbox>
  <Checkbox value="children">
    <div className="checkbox" aria-hidden="true">
      <svg viewBox="0 0 18 18"><polyline points="1 9 7 14 15 4" /></svg>
    </div>
    С детьми
  </Checkbox>
  <Checkbox value="friends">
    <div className="checkbox" aria-hidden="true">
      <svg viewBox="0 0 18 18"><polyline points="1 9 7 14 15 4" /></svg>
    </div>
    С друзьями
  </Checkbox>
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
            <CheckboxGroup>
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
  <Checkbox value="less_hour">
    <div className="checkbox" aria-hidden="true">
      <svg viewBox="0 0 18 18"><polyline points="1 9 7 14 15 4" /></svg>
    </div>
    меньше часа
  </Checkbox>
  <Checkbox value="one_two">
    <div className="checkbox" aria-hidden="true">
      <svg viewBox="0 0 18 18"><polyline points="1 9 7 14 15 4" /></svg>
    </div>
    от 1 до 2 часов
  </Checkbox>
  <Checkbox value="two_five">
    <div className="checkbox" aria-hidden="true">
      <svg viewBox="0 0 18 18"><polyline points="1 9 7 14 15 4" /></svg>
    </div>
    от 2 до 5 часов
  </Checkbox>
  <Checkbox value="two_five">
    <div className="checkbox" aria-hidden="true">
      <svg viewBox="0 0 18 18"><polyline points="1 9 7 14 15 4" /></svg>
    </div>
    от 6 до 12 часов
  </Checkbox>
</CheckboxGroup>
<CheckboxGroup>
            <Label className='Label'>
            <svg width="25" height="24" viewBox="0 0 25 24" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M21.2092 22.0095H22.5092V19.4095H21.2092V22.0095ZM3.81836 20.7095H2.51836C2.51836 21.4274 3.10039 22.0095 3.81836 22.0095L3.81836 20.7095ZM5.11836 3.3186V2.0186H2.51836V3.3186H5.11836ZM21.2092 7.18324H22.5092V5.88324H21.2092V7.18324ZM12.5384 10.6862L13.3494 9.67018L12.441 8.94509L11.6191 9.76695L12.5384 10.6862ZM15.4123 12.9802L14.6013 13.9962L15.5097 14.7213L16.3315 13.8994L15.4123 12.9802ZM17.3446 5.88324H16.0446V8.48324H17.3446V5.88324ZM19.9092 11.0479V12.3479H22.5092V11.0479H19.9092ZM7.90642 13.4797L6.98718 14.3989L8.82566 16.2374L9.7449 15.3181L7.90642 13.4797ZM21.2092 19.4095H3.81836V22.0095H21.2092V19.4095ZM5.11836 20.7095V3.3186H2.51836V20.7095H5.11836ZM20.29 6.264L14.493 12.061L16.3315 13.8994L22.1285 8.10248L20.29 6.264ZM16.2233 11.9642L13.3494 9.67018L11.7274 11.7022L14.6013 13.9962L16.2233 11.9642ZM17.3446 8.48324H21.2092V5.88324H17.3446V8.48324ZM19.9092 7.18324V11.0479H22.5092V7.18324H19.9092ZM11.6191 9.76695L7.90642 13.4797L9.7449 15.3181L13.4576 11.6054L11.6191 9.76695Z" fill="#1D1D1D"/>
</svg>

Рейтинг
</Label>
  <Checkbox value="9">
    <div className="checkbox" aria-hidden="true">
      <svg viewBox="0 0 18 18"><polyline points="1 9 7 14 15 4" /></svg>
    </div>
    Превосходно: 9+
  </Checkbox>
  <Checkbox value="8">
    <div className="checkbox" aria-hidden="true">
      <svg viewBox="0 0 18 18"><polyline points="1 9 7 14 15 4" /></svg>
    </div>
    Очень хорошо: 8+
  </Checkbox>
  <Checkbox value="7">
    <div className="checkbox" aria-hidden="true">
      <svg viewBox="0 0 18 18"><polyline points="1 9 7 14 15 4" /></svg>
    </div>
    Хорошо: 7+
  </Checkbox>
  <Checkbox value="6">
    <div className="checkbox" aria-hidden="true">
      <svg viewBox="0 0 18 18"><polyline points="1 9 7 14 15 4" /></svg>
    </div>
    Достаточно хорошо: 6+
  </Checkbox>
</CheckboxGroup>
<Button>
    Построить маршрут
</Button>
        </div>
    </div>
    )
}

export const RouteCreate = () => {
    const [isCustomRoute, setIsCustomRoute] = useState(true);
    return (
        <div className='RouteCreate'>
        <div className='RouteCreate-Inside'>
            <div>
            <Label className='Label Label-Big'>
                    Маршруты
                </Label>
                <div className='Toggle'>
            <Button className={isCustomRoute ? "Toggle-Transparent" : undefined} onPress={() => setIsCustomRoute(false)}>
    Готовые маршруты
</Button>
<Button className={isCustomRoute ? undefined : "Toggle-Transparent"} onPress={() => setIsCustomRoute(true)}>
    Свой маршрут
</Button>
</div>
<DatePicker style={{ marginTop: "4px" }}>
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
<CustomRoute/>
        </div>
        
    );
};
