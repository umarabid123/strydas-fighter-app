import { ActivityIndicator, View } from 'react-native';
import { useLoadedAssets } from './hooks/useLoadedAssets';
import RootNavigator from './navigation';

// Optional: Add fonts loading here if needed, but for now we skip specific font loading
// unless we find the font files.

export default function App() {
    const isLoadingComplete = useLoadedAssets();

    if (!isLoadingComplete) {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <ActivityIndicator />
            </View>
        );
    }

    return <RootNavigator />;
}
