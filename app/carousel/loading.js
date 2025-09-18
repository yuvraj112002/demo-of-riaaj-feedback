export default function Loading() {
  // console.log('Loading carousel...');
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="h-8 w-8 animate-spin mx-auto mb-4 border-2 border-primary border-t-transparent rounded-full" />
        <p className="text-muted-foreground">Loading.........</p>
      </div>
    </div>
  )
}
