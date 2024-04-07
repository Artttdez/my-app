import React from 'react';
import { Button, Menu, MenuItem, MenuTrigger, Popover } from 'react-aria-components';
import { useMutation, useQuery } from 'react-query';
import { useNavigate } from 'react-router-dom';
import { BACK_URL } from '../../contants';

import './Header.css';

export const Header = () => {
    // const { mutate: onLogin } = useMutation(async () => { console.log(22); await fetch(BACK_URL + '/callback-oauth-yandex')});

    const onLogin = () => {
        const history = useNavigate();

        // Redirect to a specific page
        history('https://russpass-hack.onrender.com/login-yandex');
    }

    let cookieState = "";
            const value = `; ${document.cookie}`;
            const parts = value.split(`; AUTH_SESSION=`);
            if (parts.length === 2) {
                cookieState = String(parts?.pop()?.split(';').shift());
            };

    const { data } = useQuery<any>(
        'repoData',
        async () => {
            let cookie = "";
            const value = `; ${document.cookie}`;
            const parts = value.split(`; AUTH_SESSION=`);
            if (parts.length === 2) {
                cookie = String(parts?.pop()?.split(';').shift());
            };

            console.log(cookie);
            
          return await fetch(
            BACK_URL + 'api/clients/profile',
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
            enabled: cookieState !== ""
        }
      );

      console.log(data);
    
    return (
        <div className='Header'>
            <div className='Header-Inside'>
            <div className='LeftMenu'>
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M0 3.04375C0 1.36273 1.36273 0 3.04375 0H16.9563C18.6373 0 20 1.36273 20 3.04375V16.9563C20 18.6373 18.6373 20 16.9563 20H3.04375C1.36273 20 0 18.6373 0 16.9563V3.04375Z" fill="#FF3000"/>
                <path d="M15.0645 16.5625C14.1717 16.5625 13.5567 16.0731 13.5567 14.5572V14.2312H14.5487V14.5574C14.5487 15.3633 14.767 15.5839 15.0645 15.5839C15.362 15.5839 15.5705 15.3633 15.5705 14.9891C15.5705 14.5189 15.5011 14.26 14.8066 13.7706C13.993 13.2046 13.6161 12.6001 13.6161 11.823C13.6161 10.8348 14.1517 10.2399 15.0645 10.2399C15.6993 10.2399 16.5427 10.4319 16.5427 12.0436V12.4178H15.5507V12.0436C15.5507 11.4104 15.3424 11.1993 15.0645 11.1993C14.767 11.1993 14.6081 11.4104 14.6081 11.7845C14.6081 12.1682 14.6973 12.4848 15.3918 13.003C16.255 13.6458 16.5625 14.1543 16.5625 14.9889C16.5625 15.8235 16.1655 16.5625 15.0645 16.5625ZM11.6815 16.5625C10.7887 16.5625 10.1737 16.1499 10.1737 14.5572V14.2312H11.1657V14.5574C11.1657 15.3633 11.384 15.5839 11.6815 15.5839C11.979 15.5839 12.1875 15.3633 12.1875 14.9891C12.1875 14.5189 12.1181 14.26 11.4236 13.7706C10.6101 13.2046 10.2331 12.6001 10.2331 11.823C10.2331 10.8348 10.7687 10.2399 11.6815 10.2399C12.3164 10.2399 13.1597 10.4319 13.1597 12.0436V12.4178H12.1677V12.0436C12.1677 11.4104 11.9594 11.1993 11.6815 11.1993C11.384 11.1993 11.2251 11.4104 11.2251 11.7845C11.2251 12.1682 11.3144 12.4848 12.0088 13.003C12.872 13.6458 13.1795 14.1543 13.1795 14.9889C13.1795 15.8235 12.7827 16.5625 11.6815 16.5625ZM15.0645 9.76006C14.1717 9.76006 13.5567 9.27069 13.5567 7.75478V7.42872H14.5487V7.75496C14.5487 8.56091 14.767 8.78151 15.0645 8.78151C15.362 8.78151 15.5705 8.56091 15.5705 8.18667C15.5705 7.71646 15.5011 7.45755 14.8066 6.96818C13.993 6.40217 13.6161 5.79767 13.6161 5.02056C13.6161 4.03233 14.1517 3.4375 15.0645 3.4375C15.6993 3.4375 16.5427 3.62945 16.5427 5.24116V5.61539H15.5507V5.24116C15.5507 4.60801 15.3424 4.3969 15.0645 4.3969C14.767 4.3969 14.6081 4.60801 14.6081 4.98206C14.6081 5.36578 14.6973 5.68236 15.3918 6.20055C16.255 6.84338 16.5625 7.3519 16.5625 8.18649C16.5625 9.02109 16.1655 9.76006 15.0645 9.76006ZM11.6815 9.76006C10.7887 9.76006 10.1737 9.34751 10.1737 7.75478V7.42872H11.1657V7.75496C11.1657 8.56091 11.384 8.78151 11.6815 8.78151C11.979 8.78151 12.1875 8.56091 12.1875 8.18667C12.1875 7.71646 12.1181 7.45755 11.4236 6.96818C10.6101 6.40217 10.2331 5.79767 10.2331 5.02056C10.2331 4.03233 10.7687 3.4375 11.6815 3.4375C12.3164 3.4375 13.1597 3.62945 13.1597 5.24116V5.61539H12.1677V5.24116C12.1677 4.60801 11.9594 4.3969 11.6815 4.3969C11.384 4.3969 11.2251 4.60801 11.2251 4.98206C11.2251 5.36578 11.3144 5.68236 12.0088 6.20055C12.872 6.84338 13.1795 7.3519 13.1795 8.18649C13.1795 9.02109 12.7827 9.76006 11.6815 9.76006ZM4.4297 14.2312H4.62817C5.06475 14.2312 5.28285 14.02 5.28285 13.0415V12.485C5.28285 11.5064 5.06456 11.2953 4.62817 11.2953H4.4297V14.2312ZM4.4297 16.4665H3.43768V10.3357H4.62817C5.9179 10.3357 6.27505 11.0457 6.27505 12.389V13.1373C6.27505 14.4804 5.9179 15.1906 4.62817 15.1906H4.4297V16.4665ZM4.62799 6.46932H4.42951V4.49287H4.62799C5.07438 4.49287 5.28266 4.63684 5.28266 5.3083V5.65371C5.28285 6.32536 5.07456 6.46932 4.62799 6.46932ZM6.46334 9.66426L5.69943 7.11214C6.06657 6.81473 6.27486 6.32536 6.27486 5.72104V5.24134C6.27486 4.11882 5.75905 3.53348 4.62799 3.53348H3.4375V9.66426H4.42951V7.42872H4.55856C4.60818 7.42872 4.67761 7.42872 4.78666 7.41905L5.3819 9.66409L6.46334 9.66426ZM7.59421 14.2312L8.10022 11.2953H8.17964L8.68546 14.2312H7.59421ZM9.06261 16.4665H10.0546L8.95337 10.3357H7.32649L6.21543 16.4665H7.20744L7.43554 15.1906H8.84432L9.06261 16.4665ZM8.23908 9.76006C7.01878 9.76006 6.79068 8.86781 6.79068 7.78361V3.53348H7.8225V7.8701C7.8225 8.62805 7.96136 8.80066 8.23908 8.80066C8.5168 8.80066 8.65565 8.62805 8.65565 7.8701V3.53348H9.68747V7.78379C9.68747 8.86781 9.45937 9.76006 8.23908 9.76006Z" fill="white"/>
            </svg>
            <svg width="2" height="20" viewBox="0 0 2 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect width="2" height="20" rx="1" fill="#D9D9D9"/>
            </svg>
            <svg width="65" height="20" viewBox="0 0 65 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M4.54043 0.223462C6.09127 0.223462 7.24039 0.633146 7.98779 1.45251C8.75387 2.27188 9.13691 3.473 9.13691 5.05587V7.59776C9.13691 9.18063 8.75387 10.3818 7.98779 11.2011C7.24039 12.0205 6.09127 12.4302 4.54043 12.4302H3.08301V19.7765H0V0.223462H4.54043ZM3.08301 3.01676V9.63687H4.54043C5.02623 9.63687 5.39993 9.50652 5.66152 9.24581C5.92311 8.9851 6.0539 8.50093 6.0539 7.7933V4.86033C6.0539 4.1527 5.92311 3.66853 5.66152 3.40782C5.39993 3.14711 5.02623 3.01676 4.54043 3.01676H3.08301Z" fill="#FF3000"/>
                <path d="M13.3957 15.2793C13.3957 15.987 13.5359 16.4898 13.8162 16.7877C14.1151 17.067 14.5075 17.2067 14.9933 17.2067C15.4791 17.2067 15.8622 17.067 16.1424 16.7877C16.4414 16.4898 16.5909 15.987 16.5909 15.2793V4.72067C16.5909 4.01303 16.4414 3.51955 16.1424 3.24022C15.8622 2.94227 15.4791 2.7933 14.9933 2.7933C14.5075 2.7933 14.1151 2.94227 13.8162 3.24022C13.5359 3.51955 13.3957 4.01303 13.3957 4.72067V15.2793ZM10.3127 4.9162C10.3127 3.33333 10.7145 2.1229 11.5179 1.28491C12.3214 0.428305 13.4798 0 14.9933 0C16.5068 0 17.6652 0.428305 18.4687 1.28491C19.2721 2.1229 19.6739 3.33333 19.6739 4.9162V15.0838C19.6739 16.6667 19.2721 17.8864 18.4687 18.743C17.6652 19.581 16.5068 20 14.9933 20C13.4798 20 12.3214 19.581 11.5179 18.743C10.7145 17.8864 10.3127 16.6667 10.3127 15.0838V4.9162Z" fill="#FF3000"/>
                <path d="M30.6181 12.486V15.0838C30.6181 16.6667 30.2257 17.8864 29.441 18.743C28.6749 19.581 27.5351 20 26.0216 20C24.5081 20 23.359 19.581 22.5743 18.743C21.8082 17.8864 21.4251 16.6667 21.4251 15.0838V4.9162C21.4251 3.33333 21.8082 2.1229 22.5743 1.28491C23.359 0.428305 24.5081 0 26.0216 0C27.5351 0 28.6749 0.428305 29.441 1.28491C30.2257 2.1229 30.6181 3.33333 30.6181 4.9162V6.81564H27.7033V4.72067C27.7033 4.01303 27.5538 3.51955 27.2548 3.24022C26.9746 2.94227 26.5915 2.7933 26.1057 2.7933C25.6199 2.7933 25.2275 2.94227 24.9286 3.24022C24.6483 3.51955 24.5081 4.01303 24.5081 4.72067V15.2793C24.5081 15.987 24.6483 16.4804 24.9286 16.7598C25.2275 17.0391 25.6199 17.1788 26.1057 17.1788C26.5915 17.1788 26.9746 17.0391 27.2548 16.7598C27.5538 16.4804 27.7033 15.987 27.7033 15.2793V12.486H30.6181Z" fill="#FF3000"/>
                <path d="M41.4294 12.486V15.0838C41.4294 16.6667 41.037 17.8864 40.2523 18.743C39.4862 19.581 38.3464 20 36.8329 20C35.3195 20 34.1703 19.581 33.3856 18.743C32.6195 17.8864 32.2365 16.6667 32.2365 15.0838V4.9162C32.2365 3.33333 32.6195 2.1229 33.3856 1.28491C34.1703 0.428305 35.3195 0 36.8329 0C38.3464 0 39.4862 0.428305 40.2523 1.28491C41.037 2.1229 41.4294 3.33333 41.4294 4.9162V6.81564H38.5146V4.72067C38.5146 4.01303 38.3651 3.51955 38.0661 3.24022C37.7859 2.94227 37.4028 2.7933 36.917 2.7933C36.4312 2.7933 36.0388 2.94227 35.7399 3.24022C35.4596 3.51955 35.3195 4.01303 35.3195 4.72067V15.2793C35.3195 15.987 35.4596 16.4804 35.7399 16.7598C36.0388 17.0391 36.4312 17.1788 36.917 17.1788C37.4028 17.1788 37.7859 17.0391 38.0661 16.7598C38.3651 16.4804 38.5146 15.987 38.5146 15.2793V12.486H41.4294Z" fill="#FF3000"/>
                <path d="M46.4671 19.7765H43.3V0.223462H46.0467V12.5978L47.1678 8.29609L49.6903 0.223462H53.0816V19.7765H50.3069V6.00559L49.0456 10.8101L46.4671 19.7765Z" fill="#FF3000"/>
                <path d="M54.7004 19.7765C54.8498 19.4041 54.9433 19.041 54.9806 18.6872C55.018 18.3147 55.0367 17.8864 55.0367 17.4022V14.3855C55.0367 13.3613 55.1768 12.4953 55.4571 11.7877C55.7561 11.0615 56.2979 10.54 57.0827 10.2235C55.7374 9.59032 55.0647 8.26816 55.0647 6.25698V4.72067C55.0647 3.21229 55.4197 2.08566 56.1298 1.34078C56.8585 0.595902 58.0263 0.223462 59.6332 0.223462H64.2857V19.7765H61.2027V11.8156H60.1377C59.4276 11.8156 58.9138 12.0019 58.5962 12.3743C58.2785 12.7467 58.1197 13.3892 58.1197 14.3017V17.3743C58.1197 17.7654 58.1104 18.0912 58.0917 18.352C58.0917 18.6127 58.073 18.8268 58.0356 18.9944C58.0169 19.162 57.9889 19.3017 57.9515 19.4134C57.9142 19.5251 57.8768 19.6462 57.8394 19.7765H54.7004ZM59.7173 3.01676C59.1754 3.01676 58.7737 3.17505 58.5121 3.49162C58.2692 3.80819 58.1477 4.3203 58.1477 5.02793V6.95531C58.1477 7.73743 58.3065 8.27747 58.6242 8.57542C58.9605 8.87337 59.4183 9.02235 59.9975 9.02235H61.2027V3.01676H59.7173Z" fill="#FF3000"/>
            </svg>
            <svg width="21" height="20" viewBox="0 0 21 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M5.28571 7.5L10.2857 12.5L15.2857 7.5" stroke="#1D1D1D" stroke-width="2" stroke-linecap="square"/>
            </svg>
            </div >
            <div className='RightMenu'>
            <Button className="MenuButton">
            <svg width="36" height="36" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path fill-rule="evenodd" clip-rule="evenodd" d="M17.9943 12.2798C16.3282 10.332 13.5498 9.80804 11.4623 11.5917C9.37472 13.3753 9.08083 16.3575 10.7202 18.467C12.0832 20.2209 16.2082 23.9201 17.5601 25.1174C17.7114 25.2513 17.787 25.3183 17.8752 25.3446C17.9522 25.3676 18.0364 25.3676 18.1134 25.3446C18.2016 25.3183 18.2773 25.2513 18.4285 25.1174C19.7805 23.9201 23.9054 20.2209 25.2684 18.467C26.9078 16.3575 26.6498 13.3566 24.5264 11.5917C22.4029 9.8268 19.6604 10.332 17.9943 12.2798Z" stroke="#1D1D1D" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
            </Button>
            <Button className="MenuButton" onPress={() => { if (data?.id)  { onLogin() } }}>
                {
                    data?.id ? 
                    <div className="UserAvatar" style={{ background: 'url(' + data.profilePhotoUrl + ')' + ' center/cover no-repeat' }} /> :
                    <svg width="36" height="36" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12.1667 25.4995C12.1667 25.0679 12.2487 24.6495 12.3696 24.25C13.0226 22.0935 15.2636 20.5 18.0045 20.5C20.7455 20.5 22.9886 22.0935 23.6416 24.25C23.7626 24.6495 23.8334 25.0979 23.8334 25.5046M21.7546 14.25C21.7546 16.3211 20.0757 18 18.0046 18C15.9336 18 14.2547 16.3211 14.2547 14.25C14.2547 12.1789 15.9336 10.5 18.0046 10.5C20.0757 10.5 21.7546 12.1789 21.7546 14.25Z" stroke="#1D1D1D" stroke-width="2" stroke-linecap="square" stroke-linejoin="round"/>
                </svg>
                }
            </Button>
            <MenuTrigger>
            <Button className="MenuButton">
            <svg width="36" height="36" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M10 18H26M10 13H26M10 23H26" stroke="black" stroke-width="2" stroke-linejoin="round"/>
            </svg>
            </Button>
                <Popover>
    <Menu >
      <MenuItem id="open">Open</MenuItem>
      <MenuItem id="rename">Rename…</MenuItem>
      <MenuItem id="duplicate">Duplicate</MenuItem>
      <MenuItem id="share">Share…</MenuItem>
      <MenuItem id="delete">Delete…</MenuItem>
    </Menu>
  </Popover>
</MenuTrigger>
            </div>
            </div>
        </div>
    )
};
