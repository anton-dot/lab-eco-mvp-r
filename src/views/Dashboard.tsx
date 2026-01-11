import React, { useEffect, useContext, useState, useRef, useCallback } from "react";
import { BigNumber, Contract } from "ethers";
import { MetmaskContext } from "../contexts/MetmaskContextProvider";
import Timer from "../components/Timer";
import Button from "../UI/Button";
import {
  LUMANAGI_PREDICTION_V1_ADDRESS,
  PREVIOUS_ROUNDS,
  NEXT_ROUNDS,
} from "../constants/contract";
import {
  convertEpochToDate,
  getSecondsDiffrence,
  getMaticValue,
} from "../utils/index";

import {
  postBetBearAbi,
  postBetBullAbi,
  getUserRounds,
  postClaimAbi,
  getEpochDetails,
  getCurrentEpoch,
} from "../contract/functions/lumangiPredicationV1";
import {
  getLatestAnswer,
  getDescription,
} from "../contract/functions/eacAggregatorProxy";
import Prev from "../components/card/Prev";
import Live from "../components/card/Live";
import Next from "../components/card/Next";
import { ReactComponent as Back } from "../assets/images/back.svg";

import AnimatedNumber from "../common/AnimatedNumber";
import { SCROLL_AMOUNT, PRESICION_LENGTH } from "../constants/common";
import { useWeb3React } from "@web3-react/core";
import WinnerTable from "../components/winner/WinnerTable";
import WinnerCardComponent from "../components/WinnerCardComponent";

const Tabs = () => {
  return (
    <>
      <div className="mx-20">
        <Button
          color="default"
          label="Crypto"
          size={"sm"}
          customStyle="!text-white ml-2"
          disabled={true}
          title="Coming Soon!!"
        />
        <Button
          color="default"
          label="Stock"
          size={"sm"}
          customStyle="!text-white ml-2"
          disabled={true}
          title="Coming Soon!!"
        />
      </div>
    </>
  );
};

const Dashboard: React.FC<{}> = () => {
  const { account } = useWeb3React();
  const {
    lumanagiPredictionV1Contract,
    postTransaction,
    eacAggregatorProxyContract,
    getBalance,
    lumanagiPredictionV1ContractSocket,
  } = useContext(MetmaskContext);
  const [userRounds, setUserRounds] = useState<any>({});
  const [rounds, setRounds] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [calculating, setCalculating] = useState<boolean>(true);
  const [currentEpoch, setCurrentEpoch] = useState<number>(-1);
  const [currentEpochData, setCurrentEpochData] = useState<any>(null);
  const [disableUpDown, setDisableUpDown] = useState<boolean>(false);
  const [seconds, setSeconds] = useState<null | number>(null);
  const [minutes, setMinutes] = useState<null | number>(null);
  const [descrition, setDescription] = useState<string>("null");
  const [oldest, setOldest] = useState<any>(null);

  const [latestAnswer, setLatestAnswer] = useState<null | number>(null);
  const [prevAnswer, setPrevAnswer] = useState<number>(0);

  const cardsContainer = useRef<HTMLDivElement>(null);

  const getRoundsData = useCallback(
    (epochArray: any[]) =>
      Promise.all(
        epochArray.map(async (epochInfo: any) => {
          const epochDetails = await getEpochDetails(
            lumanagiPredictionV1Contract as Contract,
            BigNumber.from(epochInfo.epoch)
          );
          return {
            ...epochDetails,
            ...epochInfo,
          };
        })
      ),
    [lumanagiPredictionV1Contract]
  );

  const setDisplayData = useCallback(async (selectedEpoch: number) => {
    const epochIds = [];
    const tempRounds = [];
    const prevData: any = {};
    if (rounds.length > 0) {
      rounds.forEach((round) => {
        prevData[round.epoch] = { ...round };
      });
    }
    for (let index = PREVIOUS_ROUNDS + 1; index > 0; index--) {
      tempRounds.push({
        ...(prevData[selectedEpoch - index]
          ? prevData[selectedEpoch - index]
          : {}),
        live: true,
        active: false,
        epoch: selectedEpoch - index,
      });
    }
    epochIds.push(selectedEpoch);
    tempRounds.push({
      live: true,
      active: true,
      epoch: selectedEpoch,
      ...(prevData[selectedEpoch] ? prevData[selectedEpoch] : {}),
    });
    for (let index = 1; index <= NEXT_ROUNDS; index++) {
      epochIds.push(selectedEpoch + index);
      tempRounds.push({
        live: false,
        active: index > 1 ? false : true,
        epoch: selectedEpoch + index,
      });
    }
    setRounds(tempRounds);
    const allData = await getRoundsData(tempRounds);
    setCurrentEpochData(allData[PREVIOUS_ROUNDS + 1]);
    setCurrentEpoch(selectedEpoch);
    const lockEpochDataTimpStamp = allData[PREVIOUS_ROUNDS + 1].lockTimestamp;
    const secondsData = getSecondsDiffrence(
      new Date(),
      convertEpochToDate(lockEpochDataTimpStamp)
    );
    setOldest(allData[0]);
    setRounds(allData.filter((data, index) => index !== 0));
    if (secondsData > 0) {
      setSeconds(secondsData % 60);
      setMinutes(secondsData < 60 ? 0 : Math.floor(secondsData / 60));
      setCalculating(false);
    }
    if (account) {
      const userRounds = await getUserRounds(
        lumanagiPredictionV1Contract as Contract,
        account
      );
      setUserRounds(userRounds);
    }
  }, [account, getRoundsData, lumanagiPredictionV1Contract, rounds]);
  /**
   * Handles callback for start round event
   * @param epoch Epoch of newly started round
   */

  const startRoundCallback = useCallback(
    async (epoch: string) => {
      const newEpoch = Number(epoch);
      setDisableUpDown(false);
      setLoading(true);
      await setDisplayData(newEpoch);
      setLoading(false);
    },
    [setDisplayData]
  );

  /**
   * Handles click of enter up button
   * @param amount: amount to be sent as bet
   */

  const betBearHandler = async (amount: Number) => {
    if (lumanagiPredictionV1Contract) {
      const abi = await postBetBearAbi(
        lumanagiPredictionV1Contract,
        currentEpoch
      );

      postTransaction(
        LUMANAGI_PREDICTION_V1_ADDRESS,
        abi,
        BigNumber.from(amount),
        undefined,
        () => {
          setDisableUpDown(true);
          setUserRounds({
            ...userRounds,
            [Number(currentEpoch)]: {
              claimable: false,
              claimed: false,
              amount: -getMaticValue(BigNumber.from(amount)),
            },
          });
        }
      );
    }
  };

  /**
   * Handles click of enter down button
   * @param amount: amount to be sent as bet
   */

  const betBullHandler = async (amount: Number) => {
    if (lumanagiPredictionV1Contract) {
      const abi = await postBetBullAbi(
        lumanagiPredictionV1Contract,
        currentEpoch
      );

      postTransaction(
        LUMANAGI_PREDICTION_V1_ADDRESS,
        abi,
        BigNumber.from(amount),
        undefined,
        () => {
          setDisableUpDown(true);
          setUserRounds({
            ...userRounds,
            [Number(currentEpoch)]: {
              claimable: false,
              claimed: false,
              amount: getMaticValue(BigNumber.from(amount)),
            },
          });
        }
      );
    }
  };

  /**
   * Handles claiming of the round
   * @param epoch round number to be claimed
   */

  const postClaim = async (epoch: BigNumber) => {
    if (lumanagiPredictionV1Contract) {
      const abi = await postClaimAbi(lumanagiPredictionV1Contract, [epoch]);
      postTransaction(
        LUMANAGI_PREDICTION_V1_ADDRESS,
        abi,
        undefined,
        undefined,
        () => {
          setUserRounds({
            ...userRounds,
            [Number(epoch)]: {
              claimable: true,
              claimed: true,
            },
          });
        }
      );
    }
  };

  /**
   * Gets all display round details for display
   * @param epochArray
   * @returns All display round details
   */

  /**
   * Gets Latest price of the currency
   */

  const getLatestPrice = useCallback(async () => {
    if (eacAggregatorProxyContract) {
      const latestAnswerTemp = await getLatestAnswer(
        eacAggregatorProxyContract
      );
      setPrevAnswer(latestAnswer ? latestAnswer : 0);
      setLatestAnswer(latestAnswerTemp);
    }
  }, [eacAggregatorProxyContract, latestAnswer]);

  /**
   * Handles betbull and betbear
   */

  const handleBetEvent = useCallback(
    async (epoch: BigNumber) => {
      if (eacAggregatorProxyContract) {
        const epochDetails = await getEpochDetails(
          lumanagiPredictionV1Contract as Contract,
          epoch
        );
        setCurrentEpochData(epochDetails);
      }
    },
    [eacAggregatorProxyContract, lumanagiPredictionV1Contract]
  );

  /**
   * Intial function calls for lumangi predication contracts
   */
  useEffect(() => {
    if (!lumanagiPredictionV1ContractSocket || !lumanagiPredictionV1Contract) {
      return;
    }

    setLoading(true);

    const startRoundEvent =
      lumanagiPredictionV1ContractSocket.events.StartRound();
    const betBearEvent = lumanagiPredictionV1ContractSocket.events.BetBear();
    const betBullEvent = lumanagiPredictionV1ContractSocket.events.BetBull();

    const startHandler = (event: any) =>
      startRoundCallback(event.returnValues.epoch);
    const betHandler = (event: any) =>
      handleBetEvent(event.returnValues.epoch);

    startRoundEvent.on("data", startHandler);
    betBearEvent.on("data", betHandler);
    betBullEvent.on("data", betHandler);

    (async () => {
      const currentEpoch = await getCurrentEpoch(
        lumanagiPredictionV1Contract
      );
      await setDisplayData(currentEpoch);
      await getBalance();

      setLoading(false);
      if (cardsContainer.current) {
        cardsContainer.current.scrollLeft =
          cardsContainer.current.offsetWidth - 750;
      }
    })();

    return () => {
      startRoundEvent.off("data", startHandler);
      betBearEvent.off("data", betHandler);
      betBullEvent.off("data", betHandler);
    };
  }, [
    getBalance,
    handleBetEvent,
    lumanagiPredictionV1Contract,
    lumanagiPredictionV1ContractSocket,
    setDisplayData,
    startRoundCallback,
  ]);

  /**
   * Intial function calls for Eac contract
   */
  useEffect(() => {
    const intervalId = setInterval(async () => {
      await getLatestPrice();
    }, 10000);

    if (eacAggregatorProxyContract) {
      (async () => {
        await getLatestPrice();
        setDescription(await getDescription(eacAggregatorProxyContract));
      })();
    }

    const element = document.getElementById("cards-data");
    const wheelHandler = (e: WheelEvent) => {
      e.preventDefault();
      if (element) {
        element.scrollLeft = element.scrollLeft + e.deltaY;
      }
    };

    element?.addEventListener("wheel", wheelHandler, { passive: false });

    return () => {
      clearInterval(intervalId);
      element?.removeEventListener("wheel", wheelHandler);
    };
  }, [eacAggregatorProxyContract, getLatestPrice]);

  const scrollCards = (where: "left" | "right") => {
    if (cardsContainer.current) {
      if (where === "left") {
        cardsContainer.current.scrollLeft -= SCROLL_AMOUNT;
      } else {
        cardsContainer.current.scrollLeft += SCROLL_AMOUNT;
      }
    }
  };
  const [age, setAge] = React.useState("");
  const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setAge(event.target.value as string);
  };

  return (
    <div className="w-full">
      <Tabs />
      <div className="flex items-center mx-20">
        <div className="justify-center w-3/5 text-center ">
          {loading ? (
            <div className="flex items-center justify-center w-48 text-white bg-[#259da822] rounded p-2 ">
              Loading...
            </div>
          ) : (
            <div className="flex items-center justify-center w-48 text-white bg-[#259da822] rounded p-2 ">
              <div className="mr-1">
                {descrition.replaceAll(" ", "").replace("/", "")}
              </div>
              <div className="text-xs">
                <AnimatedNumber
                  n={latestAnswer ? latestAnswer : 0}
                  from={prevAnswer}
                  decimals={PRESICION_LENGTH}
                />
              </div>
            </div>
          )}
        </div>

        <div className="w-2/5">
          <Timer
            seconds={seconds}
            minutes={minutes}
            setSeconds={setSeconds}
            setMinutes={setMinutes}
            setDisableUpDown={setDisableUpDown}
            setCalculating={setCalculating}
          />
        </div>
      </div>
      <div
        className="grid grid-flow-col auto-cols-[100%] grid-rows-none gap-4 mt-10  w-100 card-data sm:auto-cols-[35%] md:auto-cols-[20%] lg:auto-cols-[20%] xl:auto-cols-[20%] 2xl:auto-cols-[20%] !overflow-x-auto w-screen px-8"
        id="cards-data"
        style={{
          height: "450px",
          overflowY: "visible",
          scrollBehavior: "smooth",
        }}
        ref={cardsContainer}
      >
        {rounds.map((data, index) => {
          if (data.epoch < currentEpoch) {
            return (
              <React.Fragment key={index}>
                <Prev
                  active={data.epoch === currentEpoch - 1}
                  minutes={minutes as number}
                  seconds={seconds as number}
                  epoch={data.epoch}
                  latestAnswer={latestAnswer as number}
                  closePrice={data.closePrice}
                  prevClosePrice={
                    index > 0
                      ? rounds[index - 1]?.closePrice || latestAnswer
                      : oldest?.closePrice || latestAnswer
                  }
                  totalAmount={data.totalAmount}
                  totalAmountDisplay={data.totalAmountDisplay}
                  loading={loading}
                  bearAmount={data.bearAmount}
                  bullAmount={data.bullAmount}
                  postClaim={postClaim}
                  userRounds={userRounds}
                  lockPrice={data.lockPrice}
                  calculating={calculating}
                  prevAnswer={prevAnswer}
                />
              </React.Fragment>
            );
          } else if (data.epoch === currentEpoch) {
            return (
              <React.Fragment key={index}>
                <Live
                  epoch={data.epoch}
                  loading={loading}
                  betBearHandler={betBearHandler}
                  betBullHandler={betBullHandler}
                  bearAmount={currentEpochData.bearAmount}
                  bullAmount={currentEpochData.bullAmount}
                  disableUpDown={disableUpDown}
                  userRounds={userRounds}
                  totalAmount={currentEpochData.totalAmount}
                  totalAmountDisplay={currentEpochData.totalAmountDisplay}
                />
              </React.Fragment>
            );
          } else {
            return (
              <React.Fragment key={index}>
                <Next epoch={data.epoch} loading={loading} />
              </React.Fragment>
            );
          }
        })}
      </div>

      <div className="flex items-center mx-20 my-16">
        <div className="flex justify-center w-full gap-8">
          <Back
            className="rotate-180 cursor-pointer stroke-white fill-white"
            onClick={() => scrollCards("left")}
          />
          <Back
            className="cursor-pointer stroke-white fill-white"
            onClick={() => scrollCards("right")}
          />
        </div>
      </div>
      <div className="flex flex-col items-center w-full gap-10 mx-20 my-10">
        <div className="flex items-center justify-center w-full text-4xl text-white">
          LEADERBOARD
        </div>
        <div className="flex items-center justify-center w-full text-white">
          <div className="flex items-center w-1/2 gap-3">
            <select
              value={age}
              onChange={handleChange}
              className="rounded border border-white/20 bg-transparent px-3 py-2 text-white outline-none focus:ring-2 focus:ring-white/30"
            >
              <option value="10" className="bg-[#0b0f2e]">
                Ten
              </option>
              <option value="20" className="bg-[#0b0f2e]">
                Twenty
              </option>
              <option value="30" className="bg-[#0b0f2e]">
                Thirty
              </option>
            </select>

            <div className="relative w-full">
              <div className="pointer-events-none absolute inset-y-0 left-2 flex items-center">
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M21 21L16.514 16.506L21 21ZM19 10.5C19 15.194 15.194 19 10.5 19C5.806 19 2 15.194 2 10.5C2 5.806 5.806 2 10.5 2C15.194 2 19 5.806 19 10.5Z"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
              <input
                className="w-full rounded border border-white/20 bg-transparent py-2 pl-10 pr-16 text-white outline-none focus:ring-2 focus:ring-white/30"
                placeholder="Search"
              />
              <button
                type="button"
                className="absolute inset-y-0 right-1 my-1 inline-flex items-center rounded bg-white px-3 text-black hover:bg-gray-200"
              >
                Abc
              </button>
            </div>
          </div>
          <div className="flex items-center justify-center w-1/2"></div>
        </div>
      </div>
      <div className="flex items-center gap-10 mx-20 my-10">
        <WinnerCardComponent
          username="abc"
          imageUrl="abc"
          additionalStyles="mt-24"
        />
        <WinnerCardComponent username="abc" imageUrl="abc" />
        <WinnerCardComponent
          username="abc"
          imageUrl="abc"
          additionalStyles="mt-32"
        />
      </div>
      <div className="flex flex-col items-center mx-20">
        <WinnerTable />
      </div>
    </div>
  );
};

export default Dashboard;
