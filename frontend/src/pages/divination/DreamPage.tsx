import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { DivinationCardHeader } from '@/components/DivinationCardHeader'
import { ResultDrawer } from '@/components/ResultDrawer'
import { useDivination } from '@/hooks/useDivination'
import { useLocalStorage } from '@/hooks'
import { getDivinationOption } from '@/config/constants'
import { Sparkles, Eye, Loader2 } from 'lucide-react'
import { useTranslation } from 'react-i18next'

const CONFIG = getDivinationOption('dream')!

export default function DreamPage() {
  const { t } = useTranslation()
  const [prompt, setPrompt] = useLocalStorage('dream_prompt', '')
  const { result, loading, resultLoading, streaming, showDrawer, setShowDrawer, onSubmit } =
    useDivination('dream')

  const handleSubmit = () => {
    onSubmit({
      prompt: prompt,
    })
  }

  return (
    <DivinationCardHeader
      title={t('divination.dream.title')}
      description={t('divination.dream.description')}
      icon={CONFIG.icon}
      divinationType="dream"
    >
      <div className="max-w-2xl mx-auto">
        <div>
          <Textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder={t('divination.dream.dreamPlaceholder')}
            maxLength={40}
            rows={3}
            className="resize-none"
          />
          <p className="text-xs text-muted-foreground mt-2">
            {t('divination.dream.dreamHint')}
          </p>
        </div>

        <div className="flex gap-2 md:gap-3 justify-center pt-4 md:pt-6">
          <Button
            onClick={() => setShowDrawer(!showDrawer)}
            variant="outline"
            className="gap-2 flex-1 md:flex-initial md:min-w-[140px]"
            disabled={!result}
          >
            <Eye className="h-4 w-4" />
            {t('divination.dream.viewResult')}
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={loading}
            className="gap-2 flex-1 md:flex-initial md:min-w-[140px] bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70"
          >
            {loading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                {t('divination.dream.divining')}
              </>
            ) : (
              <>
                <Sparkles className="h-4 w-4" />
                {t('divination.dream.start')}
              </>
            )}
          </Button>
        </div>
      </div>

      <ResultDrawer
        show={showDrawer}
        onClose={() => setShowDrawer(false)}
        result={result}
        loading={resultLoading}
        streaming={streaming}
      />
    </DivinationCardHeader>
  )
}
