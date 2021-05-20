package main

import (
	"os"

	"github.com/user/planet/cmd/planetd/cmd"
    svrcmd "github.com/cosmos/cosmos-sdk/server/cmd"
	"github.com/user/planet/app"
)

func main() {
	rootCmd, _ := cmd.NewRootCmd()
    if err := svrcmd.Execute(rootCmd, app.DefaultNodeHome); err != nil {
		os.Exit(1)
	}
}
