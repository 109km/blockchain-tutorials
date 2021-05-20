package cli

import (
    "strconv"
	"github.com/spf13/cobra"

    "github.com/cosmos/cosmos-sdk/client"
	"github.com/cosmos/cosmos-sdk/client/flags"
	"github.com/cosmos/cosmos-sdk/client/tx"
	"github.com/user/planet/x/blog/types"
)

func CmdCreateTimedoutPost() *cobra.Command {
	cmd := &cobra.Command{
		Use:   "create-timedoutPost [title] [chain]",
		Short: "Creates a new timedoutPost",
		Args:  cobra.ExactArgs(2),
		RunE: func(cmd *cobra.Command, args []string) error {
      argsTitle := string(args[0])
      argsChain := string(args[1])
      
			clientCtx, err := client.GetClientTxContext(cmd)
			if err != nil {
				return err
			}

			msg := types.NewMsgCreateTimedoutPost(clientCtx.GetFromAddress().String(), string(argsTitle), string(argsChain))
			if err := msg.ValidateBasic(); err != nil {
				return err
			}
			return tx.GenerateOrBroadcastTxCLI(clientCtx, cmd.Flags(), msg)
		},
	}

	flags.AddTxFlagsToCmd(cmd)

    return cmd
}

func CmdUpdateTimedoutPost() *cobra.Command {
	cmd := &cobra.Command{
		Use:   "update-timedoutPost [id] [title] [chain]",
		Short: "Update a timedoutPost",
		Args:  cobra.ExactArgs(3),
		RunE: func(cmd *cobra.Command, args []string) error {
            id, err := strconv.ParseUint(args[0], 10, 64)
            if err != nil {
                return err
            }

      argsTitle := string(args[1])
      argsChain := string(args[2])
      
			clientCtx, err := client.GetClientTxContext(cmd)
			if err != nil {
				return err
			}

			msg := types.NewMsgUpdateTimedoutPost(clientCtx.GetFromAddress().String(), id, string(argsTitle), string(argsChain))
			if err := msg.ValidateBasic(); err != nil {
				return err
			}
			return tx.GenerateOrBroadcastTxCLI(clientCtx, cmd.Flags(), msg)
		},
	}

	flags.AddTxFlagsToCmd(cmd)

    return cmd
}

func CmdDeleteTimedoutPost() *cobra.Command {
	cmd := &cobra.Command{
		Use:   "delete-timedoutPost [id] [title] [chain]",
		Short: "Delete a timedoutPost by id",
		Args:  cobra.ExactArgs(1),
		RunE: func(cmd *cobra.Command, args []string) error {
            id, err := strconv.ParseUint(args[0], 10, 64)
            if err != nil {
                return err
            }

			clientCtx, err := client.GetClientTxContext(cmd)
			if err != nil {
				return err
			}

			msg := types.NewMsgDeleteTimedoutPost(clientCtx.GetFromAddress().String(), id)
			if err := msg.ValidateBasic(); err != nil {
				return err
			}
			return tx.GenerateOrBroadcastTxCLI(clientCtx, cmd.Flags(), msg)
		},
	}

	flags.AddTxFlagsToCmd(cmd)

    return cmd
}
