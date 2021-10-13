import PropTypes from 'prop-types';
import Slider from 'react-slick';
import classnames from 'classnames/bind';

import { scoped } from '@nti/lib-locale';
import { Hooks } from '@nti/web-commons';

import Text from '../text';

import Styles from './Quotes.css';
import Accenture from './images/accenture.png';
import Airbnb from './images/airbnb.png';
import BakerHughes from './images/baker-hughes.png';
import Boeing from './images/boeing.png';
import Chegg from './images/chegg.png';
import Google from './images/google.png';
import HR from './images/hr.png';
import AshleySquier from './images/ashley_squier.jpg';
import DavidNorth from './images/david_north.jpg';
import DrHeidi from './images/dr_heidi_scott.jpg';
import DrSridhar from './images/dr_sridhar_radhakrishnan.jpg';

const { useResolver } = Hooks;
const { isResolved } = useResolver;

const cx = classnames.bind(Styles);
const t = scoped('web-environments.common.embeds.Quotes', {
	companies: {
		label: 'Trusted by great teams across the global.',
		accenture: 'Accenture',
		airbnb: 'AirBnb',
		bakerHughes: 'BakerHughes',
		boeing: 'Boeing',
		chegg: 'Chegg',
		google: 'Google',
		hr: 'HR.com',
	},
});

function getData() {
	return {
		companies: {
			label: t('companies.label'),
			list: [
				{ name: t('accenture'), img: Accenture },
				{ name: t('airbnb'), img: Airbnb },
				{ name: t('bakerHughes'), img: BakerHughes },
				{ name: t('boeing'), img: Boeing },
				{ name: t('chegg'), img: Chegg },
				{ name: t('google'), img: Google },
				{ name: t('hr'), img: HR },
			],
		},
		quotes: [
			{
				title: 'Thumbs up for NextThought!',
				description:
					"Working with NextThought's team in our implementation process proved successful in numerous ways. They were responsive to our needs, worked tirelessly to exceed expectations and timelines, and helped us achieve our desired user experience.",
				avatar: DrHeidi,
				name: 'Dr. Heidi Scott',
				position: 'Chief Learning Officer',
				company: 'HR.com',
			},
			{
				title: 'A joy to work with',
				description:
					"NextThought was instrumental in the success of the Online Master's program in Data Science and Analytics. The students found the platform easy to navigate with its crisp and clear interface.",
				avatar: DrSridhar,
				name: 'Dr. Sridhar Radhakrishnan',
				position: 'Director of the School of Computer Science',
				company: 'The University of Oklahoma',
			},
			{
				title: 'A true business partner',
				description:
					"The NT platform has enhanced our business model; it has allowed us to market and sell a product we couldn't before. The platform's intuitive navigation makes it easy for our audience to navigate, and it's easy for us to edit course structure and features.",
				avatar: AshleySquier,
				name: 'Ashley Squier',
				position: 'Manager of Learning and Development',
				company: 'PRMIA',
			},
			{
				title: 'A great experience!',
				description:
					"I've worked with NextThought over the past four years to provide a great online educational experience for my college-level Software Engineering classes. NextThought has provided easy to use tools and excellent support. I've received outstanding feedback from my students about using NextThought in my classes.",
				avatar: DavidNorth,
				name: 'David North',
				position: 'Associate Professor of Computer Science',
				company: 'Oklahoma Christian University',
			},
		],
	};
}

const SliderSettings = {
	className: cx('quotes'),
	infinite: false,
	variableWidth: true,
	slidesToShow: 1,
	responsive: [
		{
			breakpoint: 1000,
			setting: {
				slidesToShow: 2,
			},
		},
	],
};

EmbededQuotes.propTypes = {
	className: PropTypes.string,
};
export default function EmbededQuotes({ className }) {
	const resolver = useResolver(() => getData(), []);
	const data = isResolved(resolver) ? resolver : null;

	const { companies, quotes } = data ?? {};

	return (
		<section className={cx('quote-embeds', className)}>
			{companies && (
				<div className={cx('companies')}>
					<Text.Base as="h2">{companies.label}</Text.Base>
					<ul className={cx('list')}>
						{companies.list.map((c, key) => (
							<li key={key}>
								<img src={c.img} alt={c.name} />
							</li>
						))}
					</ul>
				</div>
			)}
			{quotes && (
				<Slider {...SliderSettings}>
					{quotes.map((quote, key) => (
						<div className={cx('slide')} key={key}>
							<div className={cx('quote')}>
								<Text.Base as="h3">{quote.title}</Text.Base>
								<Text.Base as="p" className={cx('body')}>
									{quote.description}
								</Text.Base>
								<div className={cx('author')}>
									<img
										className={cx('avatar')}
										src={quote.avatar}
										alt={quote.name}
									/>
									<div className={cx('info')}>
										<Text.Base className={cx('name')}>
											{quote.name}
										</Text.Base>
										<Text.Base className={cx('position')}>
											{quote.position}
										</Text.Base>
										<Text.Base className={cx('company')}>
											{quote.company}
										</Text.Base>
									</div>
								</div>
							</div>
						</div>
					))}
				</Slider>
			)}
		</section>
	);
}
