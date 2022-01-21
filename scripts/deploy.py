import click
import traceback

from eth_utils import is_checksum_address

from brownie import accounts, network, interface, FluxAggregator
from brownie.network import gas_price
from brownie.network.gas.strategies import LinearScalingStrategy


def main():
    fork_mode = False
    if click.confirm("正在 Fork 网运行?", default="N"):
        fork_mode = True

    click.echo("提示：请确认部署参数是否已完成调整？")
    if fork_mode:
        gov = accounts.at("0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266", True)
    else:
        if not click.confirm(f"当前网络 {network.show_active()}，是否确认在此网络部署？", default="Y"):
            return
        gov = accounts.load(click.prompt("Governance 管理员/部署者，请选择括号中待选的本地账号", type=click.Choice(accounts.load())))

    click.echo(f"正在使用: 'gov' [{gov.address}]")
    click.echo(f"当前账户 BCH 余额: {gov.balance()}")

    prevBalance = gov.balance()
    gas_strategy = LinearScalingStrategy("10 gwei", "50 gwei", 1.1)
    gas_price(gas_strategy)

    try:
        timeout = 30
        decimals = 18
        validator = '0x0000000000000000000000000000000000000000'
        link_token = '0xc351628EB244ec633d5f21fBD6621e1a683B1181'
        node_account = '0xd43eC21C4C2de8c30167861cE100aA8b9ea0D7Ac'
        payment_amount = 0
        min_submission_value = 100
        max_submission_value = 50000 * (10 ** 18)

        # BCH/USD
        description = "BCH/USD"
        bch_usd_flux = FluxAggregator.deploy(
                link_token,
                payment_amount,
                timeout, validator,
                min_submission_value,
                max_submission_value,
                decimals,
                description, {'from': gov}
        )
        bch_usd_flux.changeOracles([], [node_account], [node_account], 1, 1, 0, {'from': gov})

        # flexUSDT/BCH
        description = "flexUSDT/BCH"
        flexusdt_bch_flux = FluxAggregator.deploy(
                link_token,
                payment_amount,
                timeout, validator,
                min_submission_value,
                max_submission_value,
                decimals,
                description, {'from': gov}
        )
        flexusdt_bch_flux.changeOracles([], [node_account], [node_account], 1, 1, 0, {'from': gov})

        # EBEN/BCH
        description = "EBEN/BCH"
        eben_bch_flux = FluxAggregator.deploy(
                link_token,
                payment_amount,
                timeout, validator,
                min_submission_value,
                max_submission_value,
                decimals,
                description, {'from': gov}
        )
        eben_bch_flux.changeOracles([], [node_account], [node_account], 1, 1, 0, {'from': gov})

        click.echo(f"BCH/USD Flux Address:      [{bch_usd_flux.address}]")
        click.echo(f"flexUSDT/BCH Flux Address: [{flexusdt_bch_flux.address}]")
        click.echo(f"EBEN/BCH Flux Address:     [{eben_bch_flux.address}]")
    except Exception:
        traceback.print_exc()
    finally:
        cost = (prevBalance - gov.balance() ) / 1e18
        click.echo(f"Gas 消耗 { cost }")