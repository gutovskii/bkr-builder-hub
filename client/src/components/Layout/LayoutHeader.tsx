import { router } from "@/main";
import { authService } from "@/services/auth.service";
import { useStore } from "@/store/store";
import type { UserPayload } from "@/types";
import { BuildOutlined, LogoutOutlined, ProfileOutlined, SaveOutlined, UserOutlined } from "@ant-design/icons";
import { Link, useNavigate } from "@tanstack/react-router";
import { Avatar, Button, Dropdown, Menu, type MenuProps } from "antd";
import { Header } from "antd/es/layout/layout";
import { jwtDecode } from "jwt-decode";

const items: MenuProps['items'] = [{
    key: 'components',
    label: 'Компоненти',
    children: [
        { key: 'cpu', label: 'Процесори', onClick: () => { 
            router.navigate({ to: '/components/$componentType', params: {componentType: 'cpuComponent'}, search: {page: 1, filters: {}} }) 
        }},
        { key: 'motherboard', label: 'Материнські плати', onClick: () => { 
            router.navigate({ to: '/components/$componentType', params: {componentType: 'motherboardComponent'}, search: {page: 1, filters: {}}}) 
        }},
        { key: 'ssd', label: 'CCД диски', onClick: () => { 
            router.navigate({ to: '/components/$componentType', params: {componentType: 'ssdComponent'}, search: {page: 1, filters: {}}}) 
        }},
        { key: 'hdd', label: 'Жорсткі диски', onClick: () => { 
            router.navigate({ to: '/components/$componentType', params: {componentType: 'hddComponent'}, search: {page: 1, filters: {}}}) 
        }},
        { key: 'videocard', label: 'Відеокарти', onClick: () => { 
            router.navigate({ to: '/components/$componentType', params: {componentType: 'videoCardComponent'}, search: {page: 1, filters: {}}}) 
        }},
        { key: 'powersupply', label: 'Джерела живлення', onClick: () => { 
            router.navigate({ to: '/components/$componentType', params: {componentType: 'powerSupplyComponent'}, search: {page: 1, filters: {}}}) 
        }},
        { key: 'cooler', label: 'Кулери', onClick: () => { 
            router.navigate({ to: '/components/$componentType', params: {componentType: 'coolerComponent'}, search: {page: 1, filters: {}}}) 
        }},
        { key: 'memory', label: 'Оперативна пам\'ять', onClick: () => { 
            router.navigate({ to: '/components/$componentType', params: {componentType: 'memoryComponent'}, search: {page: 1, filters: {}}}) 
        }},
        { key: 'case', label: 'Кейси', onClick: () => { 
            router.navigate({ to: '/components/$componentType', params: {componentType: 'caseComponent'}, search: {page: 1, filters: {}}}) 
        }},
    ]}, 
    {
        key: 'users builds',
        label: 'Готові збірки',
        onClick: () => router.navigate({ to: '/builds' })
    }, 
    {
        key: 'create build',
        label: 'Створити збірку',
        onClick: () => router.navigate({ to: '/builds/create' }),
        className: 'bg-blue-300 !text-black hover:!text-white'
    }
];

const userDropdownItems: MenuProps['items'] = [
    {
        key: 1,
        icon: <ProfileOutlined />,
        label: 'Мій профіль',
        onClick: () => router.navigate({ to: '/users/$nickname', params: {nickname: jwtDecode<UserPayload>(localStorage.getItem('token')!).nickname} }),
    },
    {
        key: 2,
        icon: <BuildOutlined />,
        label: 'Мої збірки',
        onClick: () => router.navigate({ to: '/builds/created' }),
    },
    {
        key: 3,
        icon: <SaveOutlined />,
        label: 'Збережені збірки',
        onClick: () => router.navigate({ to: '/builds/saved' }),
    },
    {
        key: 4,
        icon: <LogoutOutlined />,
        label: 'Вихід',
        danger: true,
        onClick: () => authService.logout(),
    }
];

export default function LayoutHeader() {
    const user = useStore((state) => state.user);
    const setUser = useStore((state) => state.setUser);
    const navigate = useNavigate();

    if (!user) {
        const token = localStorage.getItem('token');
        if (token) {
            const decoded = jwtDecode<UserPayload>(token);
            setUser(decoded);
        }
    }

    return <Header className="flex justify-between items-center !pl-3">
        <div className="flex items-center">
            <div className="min-w-[200px]">
                <Link to="/components">
                    <p className="no-underline text-white text-3xl">BUILDER HUB</p>
                </Link>
            </div>
            <div className="min-w-auto md:min-w-[400px]">
                <Menu
                    theme="dark"
                    mode="horizontal"
                    items={items}
                />
            </div>
        </div>
        <div>
            {user ? 
                <Dropdown menu={{ items: userDropdownItems }} >
                    <div className="flex gap-2 items-center cursor-pointer" onClick={() => navigate({ to: '/users/$nickname', params: {nickname: jwtDecode<UserPayload>(localStorage.getItem('token')!).nickname} })}> 
                        <p className="hidden md:block text-white">Привіт, {user.nickname}</p>
                        {user.avatarUrl ? <Avatar src={user.avatarUrl} /> : <UserOutlined style={{fill: '#fff'}} />}
                    </div>
                </Dropdown> : 
                    <Button onClick={() => navigate({ to: '/login' })}>Login</Button>
            }
        </div>
    </Header>
}