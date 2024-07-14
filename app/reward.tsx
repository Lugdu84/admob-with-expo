import { View, Text, Button } from 'react-native';
import { useEffect, useState } from 'react';
import {
	RewardedAd,
	RewardedAdEventType,
	TestIds,
} from 'react-native-google-mobile-ads';

const adUnitId = __DEV__
	? TestIds.REWARDED
	: 'ca-app-pub-xxxxxxxxxxxxx/yyyyyyyyyyyyyy';

const rewarded = RewardedAd.createForAdRequest(adUnitId, {
	keywords: ['fashion', 'clothing'],
});

export default function RewardedScreen() {
	const [loaded, setLoaded] = useState(false);

	useEffect(() => {
		const unsubscribeLoaded = rewarded.addAdEventListener(
			RewardedAdEventType.LOADED,
			() => {
				setLoaded(true);
			}
		);
		const unsubscribeEarned = rewarded.addAdEventListener(
			RewardedAdEventType.EARNED_REWARD,
			(reward) => {
				console.log('User earned reward of ', reward);
			}
		);

		// Start loading the rewarded ad straight away
		rewarded.load();

		// Unsubscribe from events on unmount
		return () => {
			unsubscribeLoaded();
			unsubscribeEarned();
		};
	}, []);

	// No advert ready to show yet
	// if (!loaded) {
	// 	return null;
	// }

	return (
		<View>
			<Button
				title="Show Rewarded Ad"
				onPress={() => {
					if (rewarded.loaded) rewarded.show();
				}}
			/>
		</View>
	);
}
