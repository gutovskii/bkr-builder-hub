import { router } from "@/main";
import { authService } from "@/services/auth.service";
import { useStore } from "@/store/store";
import type { UserPayload } from "@/types";
import { BuildOutlined, LogoutOutlined, ProfileOutlined, SaveOutlined, UserOutlined } from "@ant-design/icons";
import { useNavigate } from "@tanstack/react-router";
import { Avatar, Button, Dropdown, Menu, Typography, type MenuProps } from "antd";
import { Header } from "antd/es/layout/layout";
import { jwtDecode } from "jwt-decode";

const items: MenuProps['items'] = [{
    key: 'components',
    label: 'Components',
    children: [
        { key: 'cpu', label: 'CPU', onClick: () => { 
            router.navigate({ to: '/components/$componentType', params: {componentType: 'cpuComponent'}, search: {page: 1, filters: {}} }) 
        }},
        { key: 'motherboard', label: 'Motherboards', onClick: () => { 
            router.navigate({ to: '/components/$componentType', params: {componentType: 'motherboardComponent'}, search: {page: 1, filters: {}}}) 
        }},
        { key: 'ssd', label: 'SSD', onClick: () => { 
            router.navigate({ to: '/components/$componentType', params: {componentType: 'ssdComponent'}, search: {page: 1, filters: {}}}) 
        }},
        { key: 'hdd', label: 'HDD', onClick: () => { 
            router.navigate({ to: '/components/$componentType', params: {componentType: 'hddComponent'}, search: {page: 1, filters: {}}}) 
        }},
        { key: 'videocard', label: 'Videocards', onClick: () => { 
            router.navigate({ to: '/components/$componentType', params: {componentType: 'videoCardComponent'}, search: {page: 1, filters: {}}}) 
        }},
        { key: 'powersupply', label: 'Power supplies', onClick: () => { 
            router.navigate({ to: '/components/$componentType', params: {componentType: 'powerSupplyComponent'}, search: {page: 1, filters: {}}}) 
        }},
        { key: 'cooler', label: 'Coolers', onClick: () => { 
            router.navigate({ to: '/components/$componentType', params: {componentType: 'coolerComponent'}, search: {page: 1, filters: {}}}) 
        }},
        { key: 'memory', label: 'Memories', onClick: () => { 
            router.navigate({ to: '/components/$componentType', params: {componentType: 'memoryComponent'}, search: {page: 1, filters: {}}}) 
        }},
        { key: 'case', label: 'Cases', onClick: () => { 
            router.navigate({ to: '/components/$componentType', params: {componentType: 'caseComponent'}, search: {page: 1, filters: {}}}) 
        }},
    ]
}, {
    key: 'create build',
    label: 'Create build',
    onClick: () => router.navigate({ to: '/builds/create' })
}, {
    key: 'users builds',
    label: 'Users builds',
    onClick: () => router.navigate({ to: '/builds' })
}];

const userDropdownItems: MenuProps['items'] = [
    {
        key: 1,
        icon: <ProfileOutlined />,
        label: 'My profile',
        onClick: () => router.navigate({ to: '/profile' }),
    },
    {
        key: 2,
        icon: <BuildOutlined />,
        label: 'My builds',
    },
    {
        key: 3,
        icon: <SaveOutlined />,
        label: 'Saved builds',
    },
    {
        key: 4,
        icon: <LogoutOutlined />,
        label: 'Logout',
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

    return <Header className="flex items-center justify-between">
        <div className="flex items-center">
            <div>
                <Typography.Title style={{color: 'white'}}>BUILDER HUB</Typography.Title>
            </div>
            <Menu
                theme="dark"
                mode="horizontal"
                items={items}
            />
        </div>
        <div>
            { user ? 
                <Dropdown menu={{ items: userDropdownItems }} >
                    <div className="flex gap-2 items-center cursor-pointer" onClick={() => navigate({ to: '/profile' })}> 
                        {/* todo onClick to profile/me */}
                        <p className="text-white">Hello, {user.nickname}</p>
                        {user.avatarUrl ? <Avatar src={user.avatarUrl} /> : <UserOutlined style={{fill: '#fff'}} />}
                    </div>
                </Dropdown> : 
                    <Button onClick={() => navigate({ to: '/login' })}>Login</Button>
            }
        </div>
    </Header>
}