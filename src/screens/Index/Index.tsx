import React from 'react';
import { Button, Calendar, CalendarCell, CalendarGrid, DateInput, DatePicker, DateSegment, Dialog, Group, Heading, Input, Popover } from 'react-aria-components';

import './Index.css';

export const Index = () => {
    return (
        <div>
        <div className='Background'>
            <img src="https://static.tildacdn.com/tild3337-3631-4733-b036-613630363665/ray6.jpg" style={{ width: "100%", height: "100%", objectFit: "cover", position: "absolute", zIndex: -1 }}/>
            <div className='Content'>
            <div className='Banner'>
                <div className='Title'>
                Спланируйте идеальное путешествие с RUSSPASS
                </div>
                <div className='Choose'>
                Москва <svg width="19" height="19" viewBox="0 0 19 19" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M4.75 7.125L9.5 11.875L14.25 7.125" stroke="#FFC300" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
</svg>
                </div>
                </div>
                <div style={{ width: "calc(100%)"}}>
                    <Input className='Location' style={{ width: "calc(100% - 22px)"}} placeholder="Найти место или событие..." />
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
        </div>
        <div className='Subtitle'>Исследуйте возможности</div>
        <div className='Options'>
            <div className='Option'>
                <div className='Circle'>
                <img src="https://uzaomos.news/upload/resize_cache/iblock/fc1/360_218_2/fc15c048bd2c4f66a35468ab196d926e.jpg" style={{ width: "100%", height: "100%", objectFit: "cover", borderRadius: "100%" }}/>
                </div>
                <div className='OptionTitle'>
                    Места
                </div>
            </div>
            <div className='Option'>
                <div className='Circle'>
                <img src="https://icdn.lenta.ru/images/2023/09/21/12/20230921123747351/pic_506e26d4f7d1b847440aa6e98c1472cb.jpg" style={{ width: "100%", height: "100%", objectFit: "cover", borderRadius: "100%"}}/>
                </div>
                <div className='OptionTitle'>
                    Маршруты
                </div>
            </div>
            <div className='Option'>
                <div className='Circle'>
                <img src="https://sun3-11.userapi.com/lzN8H3sq4cC7a2OV6JBZiwfN3EmKL3e8dFNOyg/IwlGmpaILgE.jpg" style={{ width: "100%", height: "100%", objectFit: "cover", borderRadius: "100%"}}/>
                </div>
                <div className='OptionTitle'>
                    Билеты
                </div>
            </div>
            <div className='Option'>
                <div className='Circle'>
                <img src="https://burobiz-a.akamaihd.net/uploads/images/143359/small_1000-a672ec2071433a42fd0eabf300a96f36.jpg" style={{ width: "100%", height: "100%", objectFit: "cover", borderRadius: "100%" }}/>
                </div>
                <div className='OptionTitle'>
                    Рестораны
                </div>
            </div>
        </div>
        </div>
    );
}