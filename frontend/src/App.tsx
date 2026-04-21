import { AppRouter } from "@core/router";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "@core/queryClient";

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AppRouter />
    </QueryClientProvider>
  );
}

export default App;
