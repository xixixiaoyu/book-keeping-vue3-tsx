import { RouteRecordRaw } from 'vue-router'
import { Welcome } from '../views/Welcome'
import { First } from '../components/welcome/first'
import { Second } from '../components/welcome/second'
import { Third } from '../components/welcome/third'
import { Forth } from '../components/welcome/forth'

export const routes: RouteRecordRaw[] = [
	{ path: '/', redirect: '/welcome' },
	{
		path: '/welcome',
		component: Welcome,
		children: [
			{ path: '', redirect: '/welcome/1' },
			{ path: '1', component: First },
			{ path: '2', component: Second },
			{ path: '3', component: Third },
			{ path: '4', component: Forth },
		],
	},
]
