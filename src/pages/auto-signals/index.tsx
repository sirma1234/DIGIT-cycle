import { useCallback } from 'react';
import { observer } from 'mobx-react-lite';
import { useStore } from '@/hooks/useStore';
import { DBOT_TABS } from '@/constants/bot-contents';
import AutoSignalsPage from './AutoSignalsPage';
import { useAutoSignalsEngine } from './useAutoSignalsEngine';

const AutoSignals = observer(() => {
    const { dashboard, run_panel } = useStore();
    const setActiveTab = useCallback(
        (tab: number) => dashboard.setActiveTab(tab),
        [dashboard],
    );
    const pageProps = useAutoSignalsEngine({
        isActive: dashboard.active_tab === DBOT_TABS.AUTO_SIGNALS,
        setActiveTab,
        runPanel: run_panel,
    });

    return <AutoSignalsPage {...pageProps} />;
});

export default AutoSignals;
