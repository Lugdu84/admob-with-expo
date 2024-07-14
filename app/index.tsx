import { Button, Text, View } from 'react-native';
import React, { useEffect, useState } from 'react';
import {
	InterstitialAd,
	RewardedAd,
	RewardedAdEventType,
	AdEventType,
	BannerAd,
	BannerAdSize,
	TestIds,
} from 'react-native-google-mobile-ads';
import { Link } from 'expo-router';

const adUnitId = __DEV__
	? TestIds.ADAPTIVE_BANNER
	: 'ca-app-pub-9930852962465831~5285054330';

const intUnitId = __DEV__
	? TestIds.INTERSTITIAL
	: 'ca-app-pub-9930852962465831~5285054330';

const rewardUnitId = __DEV__
	? TestIds.REWARDED
	: 'ca-app-pub-9930852962465831~5285054330';

const rewarded = RewardedAd.createForAdRequest(rewardUnitId, {
	keywords: ['fashion', 'clothing'],
});

const interstitial = InterstitialAd.createForAdRequest(intUnitId, {
	keywords: ['fashion', 'clothing'],
});

export default function HomeScreen() {
	const [intLoaded, setIntLoaded] = useState(false);
	const [rewardLoaded, setRewardLoaded] = useState(false);

	useEffect(() => {
		const unsubscribe = interstitial.addAdEventListener(
			AdEventType.LOADED,
			() => {
				setIntLoaded(true);
			}
		);

		const unsubscribeLoaded = rewarded.addAdEventListener(
			RewardedAdEventType.LOADED,
			() => {
				setRewardLoaded(true);
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

		// Start loading the interstitial straight away
		interstitial.load();

		// Unsubscribe from events on unmount

		return () => {
			unsubscribeLoaded;
			unsubscribeEarned;
			unsubscribe;
		};
	}, []);

	// No advert ready to show yet
	if (!intLoaded || !rewardLoaded) {
		return null;
	}

	return (
		<View
			style={{
				flex: 1,
				justifyContent: 'space-around',
				alignItems: 'center',
			}}>
			<Text>Edit app/index.tsx to edit this screen.</Text>
			<Link href="/reward">Go to Reward Screen</Link>

			<Button
				title="Show Interstitial"
				onPress={() => {
					interstitial.show();
				}}
			/>
			<Button
				title="Show Rewarded Ad"
				onPress={() => {
					if (rewarded.loaded) {
						rewarded.show();
					}
				}}
			/>
			<BannerAd
				unitId={adUnitId}
				size={BannerAdSize.ANCHORED_ADAPTIVE_BANNER}
				requestOptions={{
					networkExtras: {
						collapsible: 'bottom',
					},
				}}
			/>
		</View>
	);
}
